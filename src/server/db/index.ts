import { env } from "@/env";

import { createClient } from "@libsql/client";

import { drizzle } from "drizzle-orm/libsql";

// import * as schema from "./schema";

export const db = drizzle(
  createClient({
    authToken: env.TURSO_AUTH_TOKEN,
    url: env.TURSO_DATABASE_URL,
  }),
);

// import { hash } from "@/server/auth";
//
// if (env.NODE_ENV === "development") {
//   db.insert(schema.users).values({
//     id: crypto.randomUUID(),
//     email: "admin",
//     name: "admin",
//     passwordHash: hash("password"),
//   });
// }
