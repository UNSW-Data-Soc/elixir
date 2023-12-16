import { Session } from "next-auth";

export const hasModeratorPermissions = (
  session: Session | null | undefined,
) => {
  if (!session) return false;
  return session.user.role === "moderator" || session.user.role === "admin";
};
