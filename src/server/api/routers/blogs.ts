import {
  createTRPCRouter,
  moderatorProcedure,
  publicProcedure, // t,
} from "@/server/api/trpc";
import { hasModeratorPermissions } from "@/server/api/utils";
import { blogs } from "@/server/db/schema";

import { TRPCError } from "@trpc/server";

import { count, desc, eq } from "drizzle-orm";
import { z } from "zod";

/** CONSTANTS + PARAMETERS **/
const BLOG_TITLE_MIN_LENGTH = 3;
const BLOG_TITLE_MAX_LENGTH = 36;
const DEFAULT_BLOG_CONTENT = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Write your exciting blog post here!" }],
    },
    { type: "paragraph" },
    { type: "horizontalRule" },
    { type: "paragraph" },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo diam, placerat eu dolor sit amet, sollicitudin gravida tortor. Ut neque leo, tristique ac arcu nec, fringilla vehicula leo. In efficitur sapien ex, eu dignissim lorem tincidunt non. ",
        },
      ],
    },
    { type: "paragraph" },
    {
      type: "image",
      attrs: {
        src: "https://static.ffx.io/images/$zoom_1%2C$multiply_1.3061%2C$ratio_1.777778%2C$width_588%2C$x_0%2C$y_22/t_crop_custom/q_86%2Cf_auto/31bc6e9479ea58d2cb31601157a7ddc9fc41ed5a",
        alt: null,
        title: null,
      },
    },
    { type: "paragraph" },
    { type: "horizontalRule" },
    { type: "paragraph" },
    {
      type: "blockquote",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Aenean lacinia dui sit amet lectus suscipit bibendum. In et nunc mollis, tempus sapien at, eleifend quam. In ultrices gravida magna, non gravida dui facilisis in. ",
            },
          ],
        },
      ],
    },
    { type: "paragraph" },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Duis sed nibh ac risus porttitor posuere a in augue. Suspendisse quam erat, luctus vel tellus non, sodales ornare lacus. Morbi ac metus mi. Phasellus eu fringilla leo, in cursus elit. Mauris sed odio aliquam, hendrerit ante vel, pulvinar orci. ",
        },
      ],
    },
  ],
};

/** HELPER FUNCTIONS **/
const createSlug = (str: string) =>
  str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
    .slice(0, 250);

/**
 * count the number of blogs with slugs that match the given slug
 */
const countSlug = async (ctx: any, slug: string) => {
  const sameSlug = await ctx.db
    .select({ count: count() })
    .from(blogs)
    .where(eq(blogs.slug, slug));
  const sameSlugCount = sameSlug[0].count;
  return sameSlugCount;
};

// TODO: create middleware to check if a blogid is valid?
// const enforceValidBlogId = t.middleware(({ ctx, next, input }) => {
//   return next({
//     ctx,
//   });
// });

/** ROUTER **/
export const blogRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    if (hasModeratorPermissions(ctx.session)) {
      return await ctx.db.select().from(blogs).orderBy(desc(blogs.createdTime));
    }

    return await ctx.db
      .select()
      .from(blogs)
      .where(eq(blogs.public, true))
      .orderBy(desc(blogs.createdTime));
  }),

  getRecent: publicProcedure
    .input(
      z.object({
        limit: z.number().int().positive().optional().default(3),
      }),
    )
    .query(async ({ ctx, input: { limit } }) => {
      return await ctx.db
        .select()
        .from(blogs)
        .where(eq(blogs.public, true))
        .orderBy(desc(blogs.createdTime))
        .limit(limit);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input: { id } }) => {
      const blogsMatch = await ctx.db
        .select()
        .from(blogs)
        .where(eq(blogs.id, id));

      // no blog found with id
      if (blogsMatch.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Blog not found" });
      }

      const blog = blogsMatch[0];

      // blog is not public, and user is not logged in
      if (!blog.public && !ctx.session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Please log in to view this blog",
        });
      }

      // blog is not public, and user is not moderator or admin
      if (!blog.public && !hasModeratorPermissions(ctx.session)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to view this blog",
        });
      }

      return blog;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input: { slug } }) => {
      const blogsMatch = await ctx.db
        .select()
        .from(blogs)
        .where(eq(blogs.slug, slug));

      // TODO: refactor repeated code

      // no blog found with slug
      if (blogsMatch.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Blog not found" });
      }

      const blog = blogsMatch[0];

      // blog is not public, and user is not logged in
      if (!blog.public && !ctx.session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Please log in to view this blog",
        });
      }

      // blog is not public, and user is not moderator or admin
      if (!blog.public && !hasModeratorPermissions(ctx.session)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to view this blog",
        });
      }

      return blog;
    }),

  create: moderatorProcedure
    .input(
      z.object({
        title: z.string().min(BLOG_TITLE_MIN_LENGTH).max(BLOG_TITLE_MAX_LENGTH),
        body: z.string().optional(),
        author: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { title, body, author } }) => {
      const id = crypto.randomUUID();
      const slug = createSlug(title);

      // check if blog with slug already exists, and edit slug accordingly
      let newSlug = slug;
      while ((await countSlug(ctx, newSlug)) !== 0) {
        newSlug = `${slug}-${crypto.randomUUID().slice(0, 4)}`;
      }

      await ctx.db.insert(blogs).values({
        id,
        author,
        slug: newSlug,
        title,
        body: body ?? JSON.stringify(DEFAULT_BLOG_CONTENT),
        public: false,
        creator: ctx.session.user.id,
      });

      return newSlug;
    }),

  update: moderatorProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z
          .string()
          .min(1)
          .min(BLOG_TITLE_MIN_LENGTH)
          .max(BLOG_TITLE_MAX_LENGTH),
        body: z.string().min(1),
        author: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input: { id, title, body, author } }) => {
      // TODO: when using SQLite, change to .returning() so it's only 1 db request
      await ctx.db
        .update(blogs)
        .set({ title, body, author, lastEditTime: new Date() })
        .where(eq(blogs.id, id));

      const numBlogsUpdated = await ctx.db
        .select({ count: count(blogs.id) })
        .from(blogs)
        .where(eq(blogs.id, id));

      return numBlogsUpdated[0];
    }),

  publish: moderatorProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.update(blogs).set({ public: true }).where(eq(blogs.id, id));

      return { id };
    }),

  unpublish: moderatorProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.update(blogs).set({ public: false }).where(eq(blogs.id, id));

      return { id };
    }),

  togglePublish: moderatorProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      const blog = await ctx.db.select().from(blogs).where(eq(blogs.id, id));

      // TODO: replace this with middleware?
      if (blog.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Blog not found" });
      }

      const newPublic = !blog[0].public;
      await ctx.db
        .update(blogs)
        .set({ public: newPublic })
        .where(eq(blogs.id, id));

      return { id };
    }),

  delete: moderatorProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.delete(blogs).where(eq(blogs.id, id));

      return { id }; // TODO: change to return number of blogs deleted? eh not important
    }),
});
