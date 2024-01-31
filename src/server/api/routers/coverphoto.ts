import { coverPhotos } from "@/server/db/schema";

import { createTRPCRouter, moderatorProcedure, publicProcedure } from "../trpc";
import { fileTypeToExtension, generateFileId } from "../utils";

import { desc } from "drizzle-orm";
import { z } from "zod";

export const coverPhotoRouter = createTRPCRouter({
  upload: moderatorProcedure
    .input(z.object({ filetype: z.string().optional() }))
    .mutation(async ({ ctx, input: { filetype } }) => {
      const id = generateFileId(filetype);

      await ctx.db.insert(coverPhotos).values({
        id,
      });

      return { id };
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const latestPhoto = await ctx.db
      .select()
      .from(coverPhotos)
      .orderBy(desc(coverPhotos.createdAt))
      .limit(1);

    if (latestPhoto.length === 0) {
      // throw new TRPCError({
      //   code: "BAD_REQUEST",
      //   message: "No cover photos found",
      // });
      return { id: null, found: false };
    }

    return { id: latestPhoto[0].id, found: true };
  }),
});
