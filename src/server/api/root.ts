import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { blogRouter } from "./routers/blogs";
import { eventRouter } from "./routers/events";

export const appRouter = createTRPCRouter({
  greeting: publicProcedure.query(() => "Hello World!"),
  auth: authRouter,
  blogs: blogRouter,
  events: eventRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
