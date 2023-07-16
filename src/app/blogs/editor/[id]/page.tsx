"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import BlogContentEditor from "../blogContentEditor";

export default function BlogsEditor({ params }: { params: { id: string } }) {
  const blogId = params.id;
  const router = useRouter();
  const session = useSession();

  if (session.status === "loading")
    return <div className="w-full h-full flex justify-center items-center p-10">Loading...</div>;
  // redirect use if unauthenticated
  if (session.status === "unauthenticated" || !session.data?.user.admin) {
    router.push("/auth/login");
  }

  return (
    <main className="px-10 sm:px-0 sm:max-w-[80%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[40%] mx-auto py-12">
      <BlogContentEditor blogId={blogId} />
    </main>
  );
}
