"use client";

import { endpoints } from "@/app/api/backend/endpoints";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEventHandler, useRef } from "react";
import toast from "react-hot-toast";

export default function BlogCreate() {
  const router = useRouter();
  const session = useSession();

  const blogTitle = useRef<string>("");
  const blogAuthor = useRef<string>("");

  if (session.status === "loading")
    return <div className="w-full h-full flex justify-center items-center p-10">Loading...</div>;
  // redirect use if unauthenticated
  if (session.status === "unauthenticated" || !session.data?.user.admin) {
    router.push("/auth/login");
  }

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const blog = await endpoints.blogs.create({
      title: blogTitle.current,
      author: blogAuthor.current,
      body: JSON.stringify({}),
      public: false,
    });

    if (!blog) {
      toast.error("Failed to create blog");
      return;
    }

    router.push(`/blogs/editor/${blog.slug}`);
  };

  return (
    <main className="flex justify-center items-center fixed top-0 left-0 h-screen w-screen">
      <div className="px-10 sm:px-0 sm:max-w-[80%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[40%] mx-auto py-12 flex flex-col gap-3">
        <h1 className="text-3xl font-bold">Start working on a new blog!</h1>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="title"
            onBlur={(e) => (blogTitle.current = e.target.value)}
            className="text-xl w-full border-b border-black py-3 outline-none mb-4"
          />
          <input
            type="text"
            placeholder="author"
            onBlur={(e) => (blogAuthor.current = e.target.value)}
            className="text-xl w-full border-b border-black py-2 outline-none mb-4"
          />
          <input
            type="submit"
            className="cursor-pointer p-3 bg-[#eee] rounded-lg hover:bg-[#ddd] transition-all"
          />
        </form>
      </div>
    </main>
  );
}
