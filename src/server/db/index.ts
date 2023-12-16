import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "@/env";
import * as schema from "./schema";
// import { hash } from "@/server/auth";

export const db = drizzle(
  connect({
    // host: env.DATABASE_HOST,
    // username: env.DATABASE_USERNAME,
    // password: env.DATABASE_PASSWORD,
    url: env.DATABASE_URL,
  }),
  { schema },
);

// if (env.NODE_ENV === "development") {
//   db.insert(schema.users).values({
//     id: crypto.randomUUID(),
//     email: "admin",
//     name: "admin",
//     passwordHash: hash("password"),
//   });
// }
