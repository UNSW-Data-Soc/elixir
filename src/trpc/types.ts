export const userLevels = ["admin", "moderator", "user"] as const;
export type UserLevel = (typeof userLevels)[number];

// TODO: add more fields
export type BlogNode =
  | {
      type: "heading";
      attrs: {};
      content: {};
    }
  | {
      type: "image";
      attrs: (
        | { src: string; blogId: null; imageId: null }
        | { src: null; blogId: string; imageId: string }
      ) & {
        alt: string | null;
        title: string | null;
      };
    };

export type BlogBody = {
  type: string;
  content: BlogNode[];
};
