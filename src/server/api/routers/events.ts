import {
  createTRPCRouter,
  moderatorProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { events } from "@/server/db/schema";

import { isModerator } from "@/app/utils";

import { TRPCError } from "@trpc/server";

import { generateFileId } from "../utils";

import { and, count, desc, eq, gt, lte } from "drizzle-orm";
import { z } from "zod";

/** CONSTANTS + PARAMETERS **/
const DEFAULT_EVENT_CONTENT = {
  type: "doc",
  content: [],
};
const DEFAULT_EVENT_LINK = ""; // TODO: change to default to website link

/** HELPER FUNCTIONS **/
const createSlug = (str: string) =>
  str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
    .slice(0, 250); // TODO: change to constant

/**
 * count the number of events with slugs that match the given slug
 */
const countSlug = async (ctx: any, slug: string) => {
  const sameSlug = await ctx.db
    .select({ count: count() })
    .from(events)
    .where(eq(events.slug, slug));
  const sameSlugCount = sameSlug[0].count;
  return sameSlugCount;
};

/** ROUTER **/
export const eventRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    if (isModerator(ctx.session)) {
      return {
        upcoming: await ctx.db
          .select()
          .from(events)
          .where(gt(events.endTime, new Date()))
          .orderBy(desc(events.startTime)),
        past: await ctx.db
          .select()
          .from(events)
          .where(lte(events.endTime, new Date()))
          .orderBy(desc(events.startTime)),
      };
    }

    return {
      upcoming: await ctx.db
        .select()
        .from(events)
        .where(and(eq(events.public, true), gt(events.endTime, new Date())))
        .orderBy(desc(events.startTime)),
      past: await ctx.db
        .select()
        .from(events)
        .where(and(eq(events.public, true), lte(events.endTime, new Date())))
        .orderBy(desc(events.startTime)),
    };
  }),

  getUpcoming: publicProcedure
    .input(
      z.object({
        limit: z.number().int().positive().optional().default(3),
      }),
    )
    .query(async ({ ctx, input: { limit } }) => {
      return await ctx.db
        .select()
        .from(events)
        .where(and(eq(events.public, true), gt(events.endTime, new Date())))
        .orderBy(desc(events.startTime))
        .limit(limit);
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input: { slug } }) => {
      const eventsMatch = await ctx.db
        .select()
        .from(events)
        .where(eq(events.slug, slug));

      // no event found with slug
      if (eventsMatch.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Event not found",
        });
      }

      const event = eventsMatch[0];

      // event is not public, and user is not logged in
      if (!event.public && !ctx.session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Please log in to view this event",
        });
      }

      // event is not public, and user is not moderator or admin
      if (!event.public && !isModerator(ctx.session)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to view this event",
        });
      }

      return event;
    }),

  create: moderatorProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1).optional(),
        eventPublic: z.boolean().optional().default(false),
        startTime: z.date(),
        endTime: z.date(),
        location: z.string().optional().default("Earth"),
        link: z.string().optional().default(DEFAULT_EVENT_LINK),
        photoFileType: z.string().optional(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          title,
          description,
          location,
          startTime,
          endTime,
          eventPublic,
          link,
          photoFileType,
        },
      }) => {
        // check that startTime is before endTime
        if (startTime > endTime) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Event must start before it ends",
          });
        }

        const id = crypto.randomUUID();
        const slug = createSlug(title);

        // check if blog with slug already exists, and edit slug accordingly
        let newSlug = slug;
        while ((await countSlug(ctx, newSlug)) !== 0) {
          newSlug = `${slug}-${crypto.randomUUID().slice(0, 4)}`;
        }

        // generate image id
        const photoId = photoFileType ? generateFileId(photoFileType) : null;

        await ctx.db.insert(events).values({
          id,
          slug: newSlug,
          title,
          description: description ?? JSON.stringify(DEFAULT_EVENT_CONTENT),
          public: eventPublic,
          creator: ctx.session.user.id,
          startTime,
          endTime,
          location,
          link,
          photo: photoId,
        });

        return { id, slug: newSlug, photoId };
      },
    ),

  update: moderatorProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        description: z.string().min(1).optional(),
        eventPublic: z.boolean().optional().default(false),
        startTime: z.date(),
        endTime: z.date(),
        location: z.string().optional().default("Earth"),
        link: z.string().optional().default(DEFAULT_EVENT_LINK),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          id,
          title,
          description,
          location,
          startTime,
          endTime,
          eventPublic,
          link,
        },
      }) => {
        // TODO: when using SQLite, change to .returning() so it's only 1 db request
        await ctx.db
          .update(events)
          .set({
            title,
            description,
            location,
            startTime,
            endTime,
            public: eventPublic,
            link,
            lastEditTime: new Date(),
          })
          .where(eq(events.id, id));

        const numEventsUpdated = await ctx.db
          .select({ count: count(events.id) })
          .from(events)
          .where(eq(events.id, id));

        return { updated: numEventsUpdated[0] };
      },
    ),

  publish: moderatorProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db
        .update(events)
        .set({ public: true })
        .where(eq(events.id, id));

      return { id };
    }),

  unpublish: moderatorProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db
        .update(events)
        .set({ public: false })
        .where(eq(events.id, id));

      return { id };
    }),

  togglePublish: moderatorProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      const event = await ctx.db.select().from(events).where(eq(events.id, id));

      // TODO: replace this with middleware?
      if (event.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Blog not found" });
      }

      const newPublic = !event[0].public;
      await ctx.db
        .update(events)
        .set({ public: newPublic })
        .where(eq(events.id, id));

      return { id };
    }),

  delete: moderatorProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.delete(events).where(eq(events.id, id));

      return { id }; // TODO: change to return number of blogs deleted? eh not important
    }),
});
