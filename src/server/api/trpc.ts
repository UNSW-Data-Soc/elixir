import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";

import { TRPCError, initTRPC } from "@trpc/server";

import { OperationMeta } from "openapi-trpc";

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
import superjson from "superjson";
import { ZodError } from "zod";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();

  return {
    db,
    session,
    ...opts,
  };
};

export const t = initTRPC
  .meta<OperationMeta>()
  .context<typeof createTRPCContext>()
  .create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });

/**
 * 3. ROUTER & PROCEDURE
 */

/**
 * Function to create new routers and sub-routers in the tRPC API.
 */
export const createTRPCRouter = t.router;

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/** Middleware that enforces that a user has moderator privileges before running the procedure */
const enforceUserIsModerator = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (ctx.session.user.role === "user") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message:
        "You need moderator privileges to perform this action. Contact IT if you think that this is a mistake. ",
    });
  }

  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: {
          ...ctx.session.user,
          role: ctx.session.user.role,
        },
      },
    },
  });
});

/** Middleware that enforces that a user has admin privileges before running the procedure */
const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (ctx.session.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message:
        "You need administrator privileges to perform this action. Contact IT if you think that this is a mistake.",
    });
  }

  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: {
          ...ctx.session.user,
          role: ctx.session.user.role,
        },
      },
    },
  });
});

/**
 * Public (unauthenticated) procedure
 */
export const publicProcedure = t.procedure;

/**
 * Procedures that require users to be logged in,
 * or have moderator or administrator privileges
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
export const moderatorProcedure = t.procedure.use(enforceUserIsModerator);
export const adminProcedure = t.procedure.use(enforceUserIsAdmin);
