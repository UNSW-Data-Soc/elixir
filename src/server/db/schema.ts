import { userLevels, userRoleGroups } from "@/trpc/types";

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  char,
  index,
  int,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

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
    role: mysqlEnum("userRole", userLevels).default("user").notNull(),
    registeredTime: timestamp("registeredTime", {
      mode: "date",
      fsp: 3,
    })
      .notNull()
      .defaultNow(),
    retired: boolean("retired").default(false),
  },
  (user) => ({
    userIdIdx: index("userIdIdx").on(user.id),
  }),
);

export const userYearsActive = mysqlTable(
  "userYearsActive",
  {
    userId: varchar("id", { length: 255 }).notNull(),
    year: int("year").notNull(),
    group: mysqlEnum("group", userRoleGroups).notNull(),
    role: text("role").notNull(), // either 'role' name for exec or 'portfolio' name for directors/subcom
  },
  (r) => ({
    compoundKey: primaryKey({
      columns: [r.userId, r.year],
    }),
  }),
);

export const resetTokens = mysqlTable(
  "resetTokens",
  {
    token: varchar("token", { length: 255 }).notNull(),
    user: varchar("id", { length: 255 }).notNull(), // TODO: .references(() => users.id, {onDelete: "cascade"})
    expires: timestamp("expires", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.token, t.user],
    }),
  }),
);

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
    photo: varchar("photoId", { length: 36 }),
  },
  (event) => ({
    eventSlugIdx: index("eventSlugIdx").on(event.slug),
  }),
);

export const companies = mysqlTable(
  "company",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    websiteUrl: text("websiteUrl"),
    logo: varchar("logoId", { length: 36 }),
  },
  (company) => ({
    companyId: index("companyIdIdx").on(company.id),
  }),
);

export const sponsorships = mysqlTable(
  "sponsorship",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    message: text("message").notNull(),
    company: varchar("companyId", { length: 255 }), // TODO: add later .references(() => companies.id, {onDelete: "cascade",})
    public: boolean("public").notNull().default(false),
    type: mysqlEnum("sponsorshipType", ["major", "partner", "other"]),
    expiration: timestamp("expiration").notNull(),
    order: int("order").notNull().default(0),
  },
  (sponsorship) => ({
    sponsorshipId: index("sponsorshipIdIdx").on(sponsorship.id),
  }),
);

export const jobPostings = mysqlTable("jobPosting", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  body: text("body").notNull(),
  company: varchar("companyId", { length: 255 }).notNull(), // TODO: add later .references(() => companies.id, {onDelete: "cascade",})
  photo: varchar("photoId", { length: 255 }),
  link: text("link"),
  public: boolean("public").notNull().default(false),
  createdTime: timestamp("createdTime").notNull().defaultNow(),
  lastEditedTime: timestamp("lastEditedTime").notNull().defaultNow(),
  expiration: timestamp("expiration").notNull(),
  creator: varchar("creatorId", { length: 255 }), // TODO: add later .references(() => users.id, {onDelete: "set null",})
});

export const coverPhotos = mysqlTable("coverphoto", {
  id: varchar("id", { length: 255 }).primaryKey(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const resources = mysqlTable("resources", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  link: text("link").notNull(), // either a link to the resource or the S3 resource id
  public: boolean("public").notNull().default(false),
  internal: boolean("internal").notNull().default(false), // whether the link is stored internally (S3) or externally (e.g. Google Drive)
  lastEditTime: timestamp("lastEditTime").notNull().defaultNow(),
  createdTime: timestamp("createdTime").notNull().defaultNow(),
});

export const tags = mysqlTable("tags", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  colour: char("colour", { length: 7 }).notNull().default("#000000"),
});

export const resourceTags = mysqlTable(
  "resourceTags",
  {
    resourceId: varchar("resourceId", { length: 255 }).notNull(), // .references(() => resources.id, {onDelete: "cascade"}),
    tagId: varchar("tagId", { length: 255 }).notNull(), // .references(() => tags.id, {onDelete: "cascade"}),
  },
  (rt) => ({
    compoundKey: primaryKey({ columns: [rt.resourceId, rt.tagId] }),
  }),
);

export const blogTags = mysqlTable(
  "blogTags",
  {
    blogId: varchar("blogId", { length: 255 }).notNull(), // .references(() => blogs.id, {onDelete: "cascade"}),
    tagId: varchar("tagId", { length: 255 }).notNull(), // .references(() => tags.id, {onDelete: "cascade"}),
  },
  (bt) => ({
    compoundKey: primaryKey({ columns: [bt.blogId, bt.tagId] }),
  }),
);

export const eventTags = mysqlTable(
  "eventTags",
  {
    eventId: varchar("eventId", { length: 255 }).notNull(), // .references(() => events.id, {onDelete: "cascade"}),
    tagId: varchar("tagId", { length: 255 }).notNull(), // .references(() => tags.id, {onDelete: "cascade"}),
  },
  (et) => ({
    compoundKey: primaryKey({ columns: [et.eventId, et.tagId] }),
  }),
);
