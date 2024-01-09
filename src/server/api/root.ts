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
  const g = genDoc as any; // hacky way to get around typescript

  for (const path in g.paths) {
    for (const method in g.paths[path]) {
      try {
        // try-catch all in case

        if (method === "get") {
          g.paths[path][method].parameters[0].content[
            "application/json"
          ].schema.properties = {
            json: {
              type: "object",
              properties:
                g.paths[path][method].parameters[0].content["application/json"]
                  .schema.properties,
            },
          };
        }
        if (method === "post") {
          g.paths[path][method].requestBody.content[
            "application/json"
          ].schema.properties = {
            json: {
              type: "object",
              properties:
                g.paths[path][method]?.requestBody.content["application/json"]
                  .schema.properties,
            },
          };
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  genDoc.info.title = "elixir backend";
  return genDoc;
}

export const generatedDoc = generateOpenAPIDocumentFromTRPCRouter(appRouter, {
  pathPrefix: "/api/trpc",
});

export const doc = fixDoc(generatedDoc);
