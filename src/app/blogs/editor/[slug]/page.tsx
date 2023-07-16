"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BlogContentEditor from "../blogContentEditor";

export const textBlockTypes = ["h1", "h2", "h3", "p", "quote"] as const;
type TextBlockType = (typeof textBlockTypes)[number];

export type BlogBlock = {
  id: string;
  order: number;
} & (
  | {
      type: "image";
      caption?: string;
      imageId?: string;
      url?: string;
      width: number;
      alignment: "left" | "center" | "right";
    }
  | {
      type: TextBlockType;
      content: string;
    }
  | {
      type: "embed";
      script: string;
    }
  | {
      type: "divider";
    }
);

export default function BlogsEditor({ params }: { params: { slug: string } }) {
  const blogSlug = params.slug;
  const router = useRouter();
  const session = useSession();

  if (session.status === "loading")
    return <div className="w-full h-full flex justify-center items-center p-10">Loading...</div>;
  // redirect use if unauthenticated
  if (session.status === "unauthenticated" || !session.data?.user.admin) {
    router.push("/auth/login");
  }

  return (
    // <main className="px-10 sm:px-0 sm:max-w-[80%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[40%] mx-auto py-12">
    <main className="p-12">
      <BlogContentEditor blogSlug={blogSlug} />
    </main>
  );
}
