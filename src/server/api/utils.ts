import { Session } from "next-auth";

/**
 * @deprecated use "isModerator" from "@/app/utils" instead
 */
export const hasModeratorPermissions = (
  session: Session | null | undefined,
) => {
  if (!session) return false;
  return session.user.role === "moderator" || session.user.role === "admin";
};

export const fileTypeToExtension = (fileType?: string) => {
  switch (fileType) {
    case "image/png":
      return ".png";
    case "image/jpg":
      return ".jpg";
    case "image/gif":
      return ".gif";
    case "image/jpeg":
      return ".jpeg";
    case "image/webp":
      return ".webp";
    case "application/pdf":
      return ".pdf";
    case "text/csv":
      return ".csv";
    case "text/plain":
      return ".txt";
    default:
      return "";
  }
};

export const generateFileId = (fileType?: string) => {
  return (crypto.randomUUID() + fileTypeToExtension(fileType)).slice(-36);
};
