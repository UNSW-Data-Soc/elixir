import {
  createTRPCRouter,
  moderatorProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { resources } from "@/server/db/schema";

import { isModerator } from "@/app/utils";

import { TRPCError } from "@trpc/server";

import { generateFileId } from "../utils";

import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const resourcesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    if (isModerator(ctx.session)) {
      return await ctx.db
        .select()
        .from(resources)
        .orderBy(desc(resources.createdTime));
    }

    return await ctx.db
      .select()
      .from(resources)
      .where(eq(resources.public, true))
      .orderBy(desc(resources.createdTime));
  }),

  create: moderatorProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        link: z.string().optional(),
        resourcePublic: z.boolean().default(false),
        resourceFileType: z.string().optional(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { title, description, link, resourcePublic, resourceFileType },
      }) => {
        const id = crypto.randomUUID();

        if (!link) {
          link = generateFileId(resourceFileType);
        }

        await ctx.db.insert(resources).values({
          id,
          title,
          description,
          link,
          public: resourcePublic,
        });

        return { id, link };
      },
    ),

  delete: moderatorProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.delete(resources).where(eq(resources.id, id));
      return { id };
    }),

  togglePublish: moderatorProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { id } }) => {
      const resourceRes = await ctx.db
        .select()
        .from(resources)
        .where(eq(resources.id, id));

      if (resourceRes.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Resource not found",
        });
      }

      const resource = resourceRes[0];

      await ctx.db
        .update(resources)
        .set({
          public: !resource.public,
        })
        .where(eq(resources.id, id));

      return { id, public: !resource.public };
    }),
});
