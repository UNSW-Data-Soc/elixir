import {
  createTRPCRouter,
  moderatorProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { resourceTags, tags } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

import { eq, and } from "drizzle-orm";

import { z } from "zod";

const createTag = async (ctx: any, name: string, colour: string) => {
  const id = crypto.randomUUID();

  await ctx.db.insert(tags).values({
    id,
    name,
    colour,
  });

  return id;
};

const resourceTagsRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(
      async ({ ctx, input: { id } }) =>
        await ctx.db
          .select({ id: tags.id, name: tags.name, colour: tags.colour })
          .from(tags)
          .innerJoin(resourceTags, eq(tags.id, resourceTags.tagId))
          .where(eq(resourceTags.resourceId, id)),
    ),

  attach: moderatorProcedure
    .input(z.object({ resourceId: z.string(), tagId: z.string() }))
    .mutation(async ({ ctx, input: { resourceId, tagId } }) => {
      // TODO: foreign keys should take care of this
      const tagsRes = await ctx.db
        .select({ id: tags.id })
        .from(tags)
        .where(eq(tags.id, tagId));

      if (tagsRes.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tag does not exist",
        });
      }

      await ctx.db.insert(resourceTags).values({
        resourceId,
        tagId,
      });
    }),

  detach: moderatorProcedure
    .input(z.object({ resourceId: z.string(), tagId: z.string() }))
    .mutation(async ({ ctx, input: { resourceId, tagId } }) => {
      await ctx.db
        .delete(resourceTags)
        .where(
          and(
            eq(resourceTags.resourceId, resourceId),
            eq(resourceTags.tagId, tagId),
          ),
        );
    }),
});

export const tagsRouter = createTRPCRouter({
  resources: resourceTagsRouter,

  create: moderatorProcedure
    .input(
      z.object({
        name: z.string().min(1),
        colour: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      }),
    )
    .mutation(async ({ ctx, input: { name, colour } }) => {
      const id = await createTag(ctx, name, colour);

      return { id };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(tags);
  }),
});