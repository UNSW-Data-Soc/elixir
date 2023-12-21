import {
  adminProcedure,
  createTRPCRouter,
  moderatorProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { hasModeratorPermissions } from "@/server/api/utils";
import { events, users } from "@/server/db/schema";

import { TRPCError } from "@trpc/server";

import { and, count, countDistinct, desc, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";

/** CONSTANTS + PARAMETERS **/

/** HELPER FUNCTIONS **/

/** ROUTER **/
// ! BEWARE, DON'T RETURN THE USER'S PASSWORD HASH...
export const usersRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: users.id,
        name: users.name,
        about: users.about,
        email: users.email,
        role: users.role,
        retired: users.retired,
        image: users.image,
        registered: users.registeredTime,
      })
      .from(users)
      .orderBy(
        sql`case ${users.role} when 'admin' then 1 when 'moderator' then 2 else 3 end, ${users.name} asc`,
      );
  }),

  getInfo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      if (ctx.session.user.id !== id && !hasModeratorPermissions(ctx.session)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to view this user's info.",
        });
      }

      const usersMatch = await ctx.db
        .select({
          id: users.id,
          name: users.name,
          about: users.about,
          email: users.email,
          role: users.role,
          retired: users.retired,
          image: users.image,
          registered: users.registeredTime,
        })
        .from(users)
        .where(eq(users.id, id));

      if (usersMatch.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }

      return usersMatch[0];
    }),

  updateInfo: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string().nonempty().optional(),
        about: z.string().optional(),
        image: z.boolean().optional().default(false),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { id = ctx.session.user.id, name, about, image },
      }) => {
        if (
          id !== ctx.session.user.id &&
          !hasModeratorPermissions(ctx.session)
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authorized to update this user's info.",
          });
        }

        // TODO: check if email already exists

        const imageId = image ? crypto.randomUUID().slice(0, 36) : null;

        await ctx.db
          .update(users)
          .set({ name, about, image: image ? imageId : undefined }) // TODO: does this delete or do nothing
          .where(eq(users.id, id));

        return { id, name, about, imageId };
      },
    ),

  updateRole: adminProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.enum(["admin", "moderator", "user"]), // TODO: refactor to constant
      }),
    )
    .mutation(async ({ ctx, input: { id, role } }) => {
      if (id === ctx.session.user.id && role !== "admin") {
        const numAdminsRes = await ctx.db
          .select({ count: countDistinct(users.id) })
          .from(users)
          .where(eq(users.role, "admin"));
        const numAdmins = numAdminsRes[0].count;

        if (numAdmins <= 1) {
          throw new TRPCError({
            message:
              "You are the only admin remaining so you cannot demote yourself.",
            code: "BAD_REQUEST",
          });
        }
      }

      await ctx.db.update(users).set({ role }).where(eq(users.id, id));

      return { id, role };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.delete(users).where(eq(users.id, id));
    }),
});
