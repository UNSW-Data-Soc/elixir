import { coverPhotos } from "@/server/db/schema";

import { TRPCError } from "@trpc/server";

import { createTRPCRouter, moderatorProcedure, publicProcedure } from "../trpc";

import { desc } from "drizzle-orm";

export const coverPhotoRouter = createTRPCRouter({
  upload: moderatorProcedure.mutation(async ({ ctx }) => {
    const id = crypto.randomUUID();

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
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No cover photos found",
      });
    }

    return { id: latestPhoto[0].id };
  }),
});
