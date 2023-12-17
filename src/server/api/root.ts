// import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { blogRouter } from "./routers/blogs";
import { eventRouter } from "./routers/events";
import { fileRouter } from "./routers/file";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  greeting: publicProcedure.query(() => "Hello World!"),
  auth: authRouter,
  blogs: blogRouter,
  events: eventRouter,
  files: fileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
