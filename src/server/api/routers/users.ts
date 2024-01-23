import {
  adminProcedure,
  createTRPCRouter,
  moderatorProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { generateFileId, hasModeratorPermissions } from "@/server/api/utils";
import { events, userYearsActive, users } from "@/server/db/schema";

import { userRoleGroups } from "@/trpc/types";

import { isAdmin } from "@/app/utils";

import { TRPCError } from "@trpc/server";

import { and, asc, count, countDistinct, eq, or, sql } from "drizzle-orm";
import { z } from "zod";

/** CONSTANTS + PARAMETERS **/

/** HELPER FUNCTIONS **/

/** ROUTER **/
const yearsActiveRouter = createTRPCRouter({
  add: adminProcedure
    .input(
      z.object({
        id: z.string(),
        year: z.number().min(2017).max(4200),
        group: z.enum(userRoleGroups),
        role: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { id, year, group, role } }) => {
      // TODO: should be done by db foreign-key checking
      const validUser = await ctx.db
        .select({ count: count() })
        .from(users)
        .where(eq(users.id, id));

      if (validUser[0].count === 0) {
        throw new TRPCError({
          message: "User not found",
          code: "BAD_REQUEST",
        });
      }

      await ctx.db.insert(userYearsActive).values({
        userId: id,
        year,
        group,
        role,
      });
    }),

  getByUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      const yearsActive = await ctx.db
        .select({
          year: userYearsActive.year,
          group: userYearsActive.group,
          role: userYearsActive.role,
        })
        .from(userYearsActive)
        .where(eq(userYearsActive.userId, id))
        .orderBy(asc(userYearsActive.year));

      return yearsActive;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string(), year: z.number() }))
    .mutation(async ({ ctx, input: { id, year } }) => {
      await ctx.db
        .delete(userYearsActive)
        .where(
          and(eq(userYearsActive.userId, id), eq(userYearsActive.year, year)),
        );
    }),
});

// ! BEWARE, DON'T RETURN THE USER'S PASSWORD HASH...
export const usersRouter = createTRPCRouter({
  yearsActive: yearsActiveRouter,

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
        name: z.string().min(1).optional(),
        about: z.string().optional(),
        imageFileType: z.string().optional(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { id = ctx.session.user.id, name, about, imageFileType },
      }) => {
        if (id !== ctx.session.user.id && !isAdmin(ctx.session)) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authorized to update this user's info.",
          });
        }

        // TODO: check if email already exists

        const imageId = imageFileType ? generateFileId(imageFileType) : null;

        await ctx.db
          .update(users)
          .set({ name, about, image: imageFileType ? imageId : undefined }) // TODO: does this delete or do nothing
          .where(eq(users.id, id));

        return { id, name, about, imageId };
      },
    ),

  updateRole: adminProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.enum(["admin", "moderator", "user"]), // TODO: refactor to constant
        retired: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { id, role, retired } }) => {
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

      await ctx.db.update(users).set({ role, retired }).where(eq(users.id, id));

      return { id, role };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.delete(users).where(eq(users.id, id));
    }),

  getTeam: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(users)
      .innerJoin(userYearsActive, eq(users.id, userYearsActive.userId))
      .where(
        or(
          eq(userYearsActive.group, "exec"),
          eq(userYearsActive.group, "director"),
        ),
      )
      .orderBy(asc(userYearsActive.year));
  }),
});
