"use client";

import { endpoints } from "../api/backend/endpoints";
import { type Blog } from "../api/backend/blogs";

import BlogsAddCard from "./blogsAddCard";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import BlogsList from "./blogList";

export default function Blog() {
  return (
    <main className="bg-white">
      <header className="flex flex-col gap-4 bg-[#4799d1] p-12 text-white">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p>
          Stay in the loop with our blog posts! From educational guides to
          opinion articles about data science in the real world, they&apos;re
          here for you!
        </p>
      </header>
      <BlogsContainer />
    </main>
  );
}

function BlogsContainer() {
  const session = useSession();

  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (session.status === "loading") return;

    const getBlogs = async () => {
      const blogs = await endpoints.blogs.getAll({
        authRequired: session.status === "authenticated",
      });
      setBlogs(blogs);
    };

    void getBlogs();
  }, [session.status]);
  console.log(session);

  return (
    <div className="m-auto flex flex-wrap justify-center gap-8 px-10 py-10 lg:container md:px-0">
      {session.status === "authenticated" && <BlogsAddCard />}

      <BlogsList />

      {session.status === "unauthenticated" && blogs.length === 0 && (
        <div className="flex h-full items-center justify-center p-10">
          <p className="text-center text-[#555]">No blogs yet!</p>
        </div>
      )}
    </div>
  );
}
