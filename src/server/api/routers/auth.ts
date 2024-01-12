import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { hash } from "@/server/auth";
import { resetTokens, users } from "@/server/db/schema";

import { env } from "@/env";

import { TRPCError } from "@trpc/server";

import { and, countDistinct, eq } from "drizzle-orm";
import { Resend } from "resend";
import { z } from "zod";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().trim(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { email, password, name } }) => {
      // check if existing user with the same email
      const sameEmail = await ctx.db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.email, email));

      if (sameEmail.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Someone has already registered with that email address.",
        });
      }

      // generate user id + password hash -> insert into db
      const id = crypto.randomUUID();
      const passwordHash = hash(password);

      await ctx.db.insert(users).values({
        id,
        email,
        name,
        passwordHash,
      });

      return { id, email, name };
    }),

  changePassword: protectedProcedure
    .input(z.object({ oldPassword: z.string(), newPassword: z.string() }))
    .mutation(async ({ ctx, input: { oldPassword, newPassword } }) => {
      // check correct password
      const oldPasswordHash = hash(oldPassword);
      const countRes = await ctx.db
        .select({ count: countDistinct(users.id) })
        .from(users)
        .where(
          and(
            eq(users.id, ctx.session.user.id),
            eq(users.passwordHash, oldPasswordHash),
          ),
        );
      if (countRes[0].count === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Incorrect password.",
        });
      }

      // update to new password
      const passwordHash = hash(newPassword);

      await ctx.db
        .update(users)
        .set({
          passwordHash,
        })
        .where(eq(users.id, ctx.session.user.id));

      return { id: ctx.session.user.id };
    }),

  sendResetToken: publicProcedure
    .input(z.object({ email: z.string().trim() }))
    .mutation(async ({ input: { email }, ctx }) => {
      const user = await ctx.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email));

      // if no user exists
      if (user.length === 0) return;

      // TODO: if token generated within the last hour, return

      // generate reset token
      const uuid = crypto.randomUUID();
      const token = hash(uuid);
      await ctx.db.insert(resetTokens).values({
        user: user[0].id,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours TODO: move to env?
      });

      // send email to user
      // TODO
      const resend = new Resend(env.RESEND_API_KEY);

      resend.emails.send({
        from: "UNSW DataSoc <hello@unswdata.com>",
        to: email,
        subject: "Password reset for DataSoc website",
        html: `<p>Please click <a href="${env.FRONTEND_URL}${env.FRONTEND_PASSWORD_RESET_SLUG}/${uuid}">here</a> to reset your password. If you didn't request a password reset, you can safely ignore this email.</p>`,
      });
    }),

  resetPassword: publicProcedure
    .input(z.object({ token: z.string(), password: z.string() }))
    .mutation(async ({ input: { token: uuid, password }, ctx }) => {
      const token = hash(uuid);

      const tokensRes = await ctx.db
        .select()
        .from(resetTokens)
        .where(eq(resetTokens.token, token));

      // check token valid
      if (tokensRes.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid token." });
      }

      const { user, expires } = tokensRes[0];

      // check token not expired
      const now = new Date();
      if (expires < now) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid token." });
      }

      // update password
      const passwordHash = hash(password); // TODO: refactor repeated code (with other route)
      await ctx.db
        .update(users)
        .set({
          passwordHash,
        })
        .where(eq(users.id, user));

      // invalidate token
      await ctx.db
        .update(resetTokens)
        .set({
          expires: now,
        })
        .where(eq(resetTokens.token, token));
    }),
});
