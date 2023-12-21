import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { authRouter } from "./routers/auth";
import { blogRouter } from "./routers/blogs";
import { companiesRouter } from "./routers/companies";
import { coverPhotoRouter } from "./routers/coverphoto";
import { eventRouter } from "./routers/events";
import { sponsorshipsRouter } from "./routers/sponsorships";
import { usersRouter } from "./routers/users";

export const appRouter = createTRPCRouter({
  greeting: publicProcedure.query(() => "Hello World!"),
  auth: authRouter,
  blogs: blogRouter,
  companies: companiesRouter,
  coverPhotos: coverPhotoRouter,
  events: eventRouter,
  sponsorships: sponsorshipsRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
