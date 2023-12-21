import {
  createTRPCRouter,
  moderatorProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { companies, sponsorships } from "@/server/db/schema";

import { isModerator } from "@/app/utils";

import { and, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";

/** CONSTANTS + PARAMETERS **/

/** HELPER FUNCTIONS **/

/** ROUTER **/
export const sponsorshipsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const now = new Date();

    if (!isModerator(ctx.session)) {
      return await ctx.db
        .select()
        .from(sponsorships)
        .innerJoin(companies, eq(sponsorships.company, companies.id))
        .where(
          and(eq(sponsorships.public, true), gt(sponsorships.expiration, now)),
        ) // only return public, non-expired sponsorships
        .orderBy(
          sql`case ${sponsorships.type} when 'major' then 1 when 'partner' then 2 else 3 end, ${sponsorships.order} desc`,
        );
    }

    return await ctx.db
      .select()
      .from(sponsorships)
      .innerJoin(companies, eq(sponsorships.company, companies.id))
      .orderBy(
        sql`case ${sponsorships.type} when 'major' then 1 when 'partner' then 2 else 3 end, ${sponsorships.order} desc`,
      );
  }),

  create: moderatorProcedure
    .input(
      z.object({
        company: z.string(),
        message: z.string(),
        type: z.enum(["major", "partner", "other"]),
        expiration: z.date(),
        order: z.number().default(0),
        sponPublic: z.boolean().default(false),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { company, message, type, expiration, order, sponPublic },
      }) => {
        const id = crypto.randomUUID();

        // TODO: check that company id is valid?

        await ctx.db.insert(sponsorships).values({
          id,
          message,
          company,
          type,
          expiration,
          order,
          public: sponPublic,
        });

        return { id };
      },
    ),

  delete: moderatorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.delete(sponsorships).where(eq(sponsorships.id, id));

      return { id }; // TODO: change to return number of sponsorships deleted? eh not important
    }),
});
