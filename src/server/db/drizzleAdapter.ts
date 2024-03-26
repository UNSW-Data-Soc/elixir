import { Adapter } from "next-auth/adapters";

import { sessions, users, verificationTokens } from "./schema";

import { and, eq } from "drizzle-orm";
import { LibSQLDatabase } from "drizzle-orm/libsql";

export function DrizzleAdapter(
  client: InstanceType<typeof LibSQLDatabase>,
): Adapter {
  return {
    // async createUser(data) {
    //   const id = crypto.randomUUID();

    //   // TODO: eh this should never be called...
    //   await client.insert(users).values({
    //     ...data,
    //     id,
    //     passwordHash: "ERROR",
    //   });

    //   return await client
    //     .select()
    //     .from(users)
    //     .where(eq(users.id, id))
    //     .then((res) => res[0]);
    // },
    async getUser(id) {
      return await client
        .select()
        .from(users)
        .where(eq(users.id, id))
        .then((res) => res[0] ?? null);
    },
    async getUserByEmail(email) {
      return await client
        .select()
        .from(users)
        .where(eq(users.email, email))
        .then((res) => res[0] ?? null);
    },
    async createSession({ sessionToken, userId, expires }) {
      await client.insert(sessions).values({ sessionToken, userId, expires });

      return await client
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .then((res) => res[0]);
    },
    async getSessionAndUser(sessionToken) {
      return (
        (await client
          .select({
            session: sessions,
            user: users,
          })
          .from(sessions)
          .where(eq(sessions.sessionToken, sessionToken))
          .innerJoin(users, eq(users.id, sessions.userId))
          .then((res) => res[0])) ?? null
      );
    },
    async updateUser(user) {
      if (!user.id) {
        throw new Error("No user id.");
      }

      await client.update(users).set(user).where(eq(users.id, user.id));

      return await client
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .then((res) => res[0]);
    },
    // async linkAccount(rawAccount) {
    //   await client.insert(accounts).values(rawAccount);
    // },
    // async getUserByAccount(account) {
    //   const dbAccount =
    //     (await client
    //       .select()
    //       .from(accounts)
    //       .where(
    //         and(
    //           eq(accounts.providerAccountId, account.providerAccountId),
    //           eq(accounts.provider, account.provider),
    //         ),
    //       )
    //       .leftJoin(users, eq(accounts.userId, users.id))
    //       .then((res) => res[0])) ?? null;

    //   if (!dbAccount) {
    //     return null;
    //   }

    //   return dbAccount.user;
    // },
    async deleteSession(sessionToken) {
      const session =
        (await client
          .select()
          .from(sessions)
          .where(eq(sessions.sessionToken, sessionToken))
          .then((res) => res[0])) ?? null;

      await client
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken));

      return session;
    },
    async createVerificationToken(token) {
      await client.insert(verificationTokens).values(token);

      return await client
        .select()
        .from(verificationTokens)
        .where(eq(verificationTokens.identifier, token.identifier))
        .then((res) => res[0]);
    },
    async useVerificationToken(token) {
      try {
        const deletedToken =
          (await client
            .select()
            .from(verificationTokens)
            .where(
              and(
                eq(verificationTokens.identifier, token.identifier),
                eq(verificationTokens.token, token.token),
              ),
            )
            .then((res) => res[0])) ?? null;

        await client
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token),
            ),
          );

        return deletedToken;
      } catch (err) {
        throw new Error("No verification token found.");
      }
    },
    async deleteUser(id) {
      const user = await client
        .select()
        .from(users)
        .where(eq(users.id, id))
        .then((res) => res[0] ?? null);

      await client.delete(users).where(eq(users.id, id));

      return user;
    },
    // async unlinkAccount(account) {
    //   await client
    //     .delete(accounts)
    //     .where(
    //       and(
    //         eq(accounts.providerAccountId, account.providerAccountId),
    //         eq(accounts.provider, account.provider),
    //       ),
    //     );

    //   return undefined;
    // },
  };
}
