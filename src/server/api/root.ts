import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { TRPCError } from "@trpc/server";

import { authRouter } from "./routers/auth";
import { blogRouter } from "./routers/blogs";
import { companiesRouter } from "./routers/companies";
import { coverPhotoRouter } from "./routers/coverphoto";
import { eventRouter } from "./routers/events";
import { jobsRouter } from "./routers/jobs";
import { resourcesRouter } from "./routers/resources";
import { sponsorshipsRouter } from "./routers/sponsorships";
import { tagsRouter } from "./routers/tags";
import { usersRouter } from "./routers/users";

import { generateOpenAPIDocumentFromTRPCRouter } from "openapi-trpc";

export const appRouter = createTRPCRouter({
  greeting: publicProcedure.query(() => "Hello World!"),
  badGreeting: publicProcedure.query(() => {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Bad greeting" });
  }),
  auth: authRouter,
  blogs: blogRouter,
  companies: companiesRouter,
  coverPhotos: coverPhotoRouter,
  events: eventRouter,
  jobs: jobsRouter,
  resources: resourcesRouter,
  sponsorships: sponsorshipsRouter,
  tags: tagsRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

// modify the generated doc to fix some issues
function fixDoc(genDoc: typeof generatedDoc) {
  // for (const path in genDoc.paths) {
  //   for (const method in genDoc.paths[path]) {
  //     if (method === "get") {
  //       console.log(
  //         genDoc.paths[path][method].parameters[0].content["application/json"]
  //           .schema.properties,
  //       );

  //       genDoc.paths[path][method].parameters[0].content[
  //         "application/json"
  //       ].schema.properties = {
  //         json: {
  //           type: "json",
  //           haha: genDoc.paths[path][method].parameters[0].content[
  //             "application/json"
  //           ].schema.properties,
  //         },
  //       };
  //     }
  //   }
  // }
  genDoc.info.title = "elixir backend";
  return genDoc;
}

export const generatedDoc = generateOpenAPIDocumentFromTRPCRouter(appRouter, {
  pathPrefix: "/api/trpc",
});

export const doc = fixDoc(generatedDoc);

// console.log(Object.keys(doc.paths));
