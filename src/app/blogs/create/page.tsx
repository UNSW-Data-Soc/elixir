"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { FormEventHandler, useRef } from "react";

import { api } from "@/trpc/react";

import { Spinner, isModerator } from "@/app/utils";

import toast from "react-hot-toast";

const BLOG_TITLE_MIN_LEN = 3;

export default function BlogCreate() {
  const router = useRouter();
  const session = useSession();

  const blogTitle = useRef<string>("");
  const blogAuthor = useRef<string>("");

  const { mutate: createBlog, isLoading: creatingBlog } =
    api.blogs.create.useMutation({
      onSuccess: (slug) => {
        toast.success("Blog created!");
        router.push(`/blogs/editor?blogSlug=${slug}`);
      },
      onError: (err) => {
        if (!err || !err.data) {
          toast.error("Failed to create blog.");
        } else if (err.data.code === "UNAUTHORIZED") {
          toast.error("Please login to create a blog.");
        } else if (err.data.code === "FORBIDDEN") {
          toast.error(
            "You do not have permission to create a blog. Please contact IT if this is a mistake.",
          );
        } else {
          toast.error("Failed to create blog.");
        }
      },
    });

  if (session.status === "loading")
    return (
      <div className="flex h-full w-full items-center justify-center p-10">
        <Spinner />
      </div>
    );

  // redirect use if unauthenticated
  if (session.status === "unauthenticated" || !isModerator(session.data)) {
    router.push("/auth/login");
  }

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (blogTitle.current.trim().length < BLOG_TITLE_MIN_LEN) {
      toast.dismiss();
      toast.error("Please enter a title.");
      return;
    }

    if (blogAuthor.current.trim().length === 0) {
      toast.dismiss();
      toast.error("Please enter an author.");
      return;
    }

    createBlog({
      title: blogTitle.current.trim(),
      author: blogAuthor.current.trim(),
    });
  };

  return (
    <main className="left-0 top-0 flex h-screen w-screen items-center justify-center">
      <div className="mx-auto flex flex-col gap-3 px-10 py-12 sm:max-w-[80%] sm:px-0 md:max-w-[75%] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[40%]">
        <h1 className="text-3xl font-bold">Start working on a new blog!</h1>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="title"
            onChange={(e) => (blogTitle.current = e.target.value)}
            className="mb-4 w-full border-b border-black py-3 text-xl outline-none"
            disabled={creatingBlog}
          />
          <input
            type="text"
            placeholder="author"
            onChange={(e) => (blogAuthor.current = e.target.value)}
            className="mb-4 w-full border-b border-black py-2 text-xl outline-none"
            disabled={creatingBlog}
          />
          <input
            type="submit"
            value="Start Editing"
            className="cursor-pointer rounded-lg bg-[#eee] p-3 transition-all hover:bg-[#ddd] active:bg-[#ccc]"
            disabled={creatingBlog}
          />
        </form>
      </div>
    </main>
  );
}
