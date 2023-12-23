import {
  createTRPCRouter,
  moderatorProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { resources } from "@/server/db/schema";

import { isModerator } from "@/app/utils";

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
      }),
    )
    .mutation(
      async ({ ctx, input: { title, description, link, resourcePublic } }) => {
        const id = crypto.randomUUID();

        if (!link) {
          link = crypto.randomUUID();
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
});
