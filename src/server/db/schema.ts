import { relations, sql } from "drizzle-orm";
import {
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  mysqlEnum,
  boolean,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `website_${name}`);

export const users = mysqlTable(
  "user",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", {
      mode: "date",
      fsp: 3,
    }).default(sql`CURRENT_TIMESTAMP(3)`),
    passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
    about: text("about"),
    image: varchar("image", { length: 255 }),
    role: mysqlEnum("userRole", ["admin", "moderator", "user"])
      .default("user")
      .notNull(),
    // TODO: yearsActive:
    retired: boolean("retired").default(false),
  },
  (user) => ({
    userIdIdx: index("userIdIdx").on(user.id),
  }),
);

// export const usersRelations = relations(users, ({ many }) => ({
//   accounts: many(accounts),
//   sessions: many(sessions),
// }));

// export const accounts = mysqlTable(
//   "account",
//   {
//     userId: varchar("userId", { length: 255 }).notNull(),
//     type: varchar("type", { length: 255 })
//       .$type<AdapterAccount["type"]>()
//       .notNull(),
//     provider: varchar("provider", { length: 255 }).notNull(),
//     providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
//     refresh_token: text("refresh_token"),
//     access_token: text("access_token"),
//     expires_at: int("expires_at"),
//     token_type: varchar("token_type", { length: 255 }),
//     scope: varchar("scope", { length: 255 }),
//     id_token: text("id_token"),
//     session_state: varchar("session_state", { length: 255 }),
//   },
//   (account) => ({
//     compoundKey: primaryKey({
//       columns: [account.provider, account.providerAccountId],
//     }),
//     userIdIdx: index("userId_idx").on(account.userId),
//   }),
// );

// export const accountsRelations = relations(accounts, ({ one }) => ({
//   user: one(users, { fields: [accounts.userId], references: [users.id] }),
// }));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
    compoundKey: primaryKey({
      columns: [session.sessionToken, session.expires, session.userId],
    }),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const blogs = mysqlTable(
  "blog",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    creator: varchar("creatorId", { length: 255 }), // TODO: add later .references(() => users.id, {onDelete: "set null",}),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    author: varchar("author", { length: 255 }).notNull(),
    createdTime: timestamp("createdTime").notNull().defaultNow(),
    lastEditTime: timestamp("lastEditTime").notNull().defaultNow(),
    public: boolean("public").notNull().default(false),
  },
  (blog) => ({
    blogSlugIdx: index("blogSlugIdx").on(blog.slug),
  }),
);

export const events = mysqlTable(
  "event",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    creator: varchar("creatorId", { length: 255 }), // TODO: add later .references(() => users.id, {onDelete: "set null",}),
    title: text("title").notNull(),
    slug: varchar("slug", { length: 255 }).unique().notNull(),
    description: text("description").notNull(),
    startTime: timestamp("startTime").notNull().defaultNow(),
    endTime: timestamp("endTime").notNull().defaultNow(),
    location: text("location").notNull(),
    link: text("link").notNull(),
    public: boolean("public").notNull().default(false),
    lastEditTime: timestamp("lastEditTime").notNull().defaultNow(),
    photo: boolean("photo").notNull().default(false),
  },
  (event) => ({
    eventSlugIdx: index("eventSlugIdx").on(event.slug),
  }),
);
