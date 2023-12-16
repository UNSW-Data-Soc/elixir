import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { hash } from "@/server/auth";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({ name: z.string(), email: z.string(), password: z.string() }),
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
});
