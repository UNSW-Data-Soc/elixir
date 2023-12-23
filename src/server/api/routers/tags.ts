import { createTRPCRouter, moderatorProcedure } from "@/server/api/trpc";
import { tags } from "@/server/db/schema";

import { z } from "zod";

export const tagsRouter = createTRPCRouter({
  create: moderatorProcedure
    .input(
      z.object({
        name: z.string().nonempty(),
        colour: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      }),
    )
    .mutation(async ({ ctx, input: { name, colour } }) => {
      const id = crypto.randomUUID();

      await ctx.db.insert(tags).values({
        id,
        name,
        colour,
      });
    }),
});
