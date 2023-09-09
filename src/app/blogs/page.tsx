"use client";

import { endpoints } from "../api/backend/endpoints";
import { type Blog } from "../api/backend/blogs";

import BlogsAddCard from "./blogsAddCard";
import BlogCard from "./blogCard";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
// import { type BlogBlock, textBlockTypes } from "./editor/blogContentEditor";

export default function Blog() {
  return (
    <main className="bg-white">
      <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p>
          Stay in the loop with our blog posts! From educational guides to opinion articles about
          data science in the real world, they&apos;re here for you!
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

  return (
    <div className="container m-auto flex gap-8 p-10 flex-wrap justify-center">
      {session.status === "authenticated" && <BlogsAddCard />}
      {blogs
        .sort((a, b) => b.created_time.localeCompare(a.created_time))
        .map((blog) => (
          <BlogCard key={blog.id} {...blog} />
        ))}

      {session.status === "unauthenticated" && blogs.length === 0 && (
        <div className="h-full flex justify-center items-center p-10">
          <p className="text-center text-[#555]">No blogs yet!</p>
        </div>
      )}
    </div>
  );
}
