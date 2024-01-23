import {
  createTRPCRouter,
  moderatorProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { companies } from "@/server/db/schema";

import { generateFileId } from "../utils";

import { asc, eq } from "drizzle-orm";
import { z } from "zod";

/** CONSTANTS + PARAMETERS **/

/** HELPER FUNCTIONS **/

/** ROUTER **/
export const companiesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(companies).orderBy(asc(companies.name));
  }),

  create: moderatorProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        websiteUrl: z.string().optional(),
        logoFileType: z.string().optional(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { name, description, websiteUrl, logoFileType },
      }) => {
        const id = crypto.randomUUID();

        // generate logo id
        const logoId = logoFileType ? generateFileId(logoFileType) : null;

        await ctx.db.insert(companies).values({
          id,
          name,
          description,
          websiteUrl,
          logo: logoId,
        });

        return { id, logoId };
      },
    ),

  // TODO: not sure if this is needed -- if we use it, we need to update how images work
  // update: moderatorProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //       name: z.string().min(1).optional(),
  //       description: z.string().optional(),
  //       websiteUrl: z.string().optional(),
  //       logo: z.union([z.boolean(), z.null()]).optional().default(null),
  //     }),
  //   )
  //   .mutation(
  //     async ({ ctx, input: { id, name, description, websiteUrl, logo } }) => {
  //       let logoId: string | null | undefined;
  //       if (logo === true) {
  //         logoId = crypto.randomUUID().slice(0, 36);
  //       } else if (logo === false) {
  //         logoId = null;
  //       } else if (logo === null) {
  //         logoId = undefined;
  //       }

  //       await ctx.db
  //         .update(companies)
  //         .set({
  //           name,
  //           description,
  //           websiteUrl,
  //           logo: logoId, // TODO: does setting logoId to undefined prevent from updating?
  //         })
  //         .where(eq(companies.id, id));

  //       return { id, logoId };
  //     },
  //   ),

  delete: moderatorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.delete(companies).where(eq(companies.id, id));

      return { id }; // TODO: change to return number of companies deleted? eh not important
    }),
});
