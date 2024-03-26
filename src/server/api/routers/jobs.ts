import {
  createTRPCRouter,
  moderatorProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { companies, jobPostings } from "@/server/db/schema";

import { isModerator } from "@/app/utils";

import { TRPCError } from "@trpc/server";

import { generateFileId } from "../utils";

import { desc, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";

/** CONSTANTS + PARAMETERS **/

/** HELPER FUNCTIONS **/

/** ROUTER **/
export const jobsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    if (isModerator(ctx.session)) {
      const jobs = await ctx.db
        .select()
        .from(jobPostings)
        .innerJoin(companies, eq(jobPostings.company, companies.id))
        .orderBy(desc(jobPostings.createdTime));
      return jobs.map((j) => ({
        jobPosting: j.jobPostings,
        company: j.companies,
      }));
    }

    const jobs = await ctx.db
      .select()
      .from(jobPostings)
      .innerJoin(companies, eq(jobPostings.company, companies.id))
      .where(eq(jobPostings.public, true))
      .orderBy(desc(jobPostings.createdTime));
    return jobs.map((j) => ({
      jobPosting: j.jobPostings,
      company: j.companies,
    }));
  }),

  create: moderatorProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string(),
        body: z.string(),
        companyId: z.string(),
        expiration: z.date(),
        link: z.string().optional(),
        photoFileType: z.string().optional(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          title,
          description,
          body,
          companyId,
          expiration,
          link,
          photoFileType,
        },
      }) => {
        const id = crypto.randomUUID();

        const photoId = photoFileType ? generateFileId(photoFileType) : null;

        await ctx.db.insert(jobPostings).values({
          id,
          title,
          description,
          body,
          company: companyId,
          expiration,
          link,
          creator: ctx.session.user.id,
          photo: photoId,
        });

        return { id, photoId };
      },
    ),

  togglePublic: moderatorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      const jobPostingRes = await ctx.db
        .select()
        .from(jobPostings)
        .where(eq(jobPostings.id, id));
      if (jobPostingRes.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Job posting not found",
        });
      }

      const jobPosting = jobPostingRes[0];

      await ctx.db
        .update(jobPostings)
        .set({ public: !jobPosting.public })
        .where(eq(jobPostings.id, id));

      return { id, public: !jobPosting.public };
    }),

  delete: moderatorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.delete(jobPostings).where(eq(jobPostings.id, id));

      return { id };
    }),
});
