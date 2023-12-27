import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "@/server/db";

import { env } from "@/env";

import { DrizzleAdapter } from "./db/drizzleAdapter";
import { users } from "./db/schema";

import { createHash } from "crypto";
import { and, eq } from "drizzle-orm";
import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from "next-auth";

export type UserRole = "admin" | "moderator" | "user";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}

export const hash = (password: string) => {
  return createHash("sha256")
    .update(password + env.SECRET_KEY)
    .digest("hex");
};

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
        role: token.role,
      },
    }),
    jwt: async ({ token, user }) => ({
      ...token,
      ...user,
    }),
  },
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "enter your email...",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "enter your password...",
        },
      },
      async authorize(credentials, _) {
        if (!credentials) {
          return null;
        }

        // look up user in database
        const userMatch = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            image: users.image,
          })
          .from(users)
          .where(
            and(
              eq(users.email, credentials.email),
              eq(users.passwordHash, hash(credentials.password)),
            ),
          );

        // no user found
        if (userMatch.length === 0) {
          return null;
        }

        const user = userMatch[0];

        return user;
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
