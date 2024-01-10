"use client";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import BlogCard from "./blogCard";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Blog = RouterOutputs["blogs"]["getAll"][number];

export default function BlogsList({ blogs: initBlogs }: { blogs: Blog[] }) {
  const { data: blogs } = api.blogs.getAll.useQuery(undefined, {
    initialData: initBlogs,
  });

  return (
    <div className="flex flex-col items-center justify-center gap-3 px-5 align-baseline">
      {blogs.length > 0 && (
        <div className="flex flex-wrap items-stretch justify-center gap-5 align-baseline">
          {blogs.map((b) => (
            <BlogCard key={b.id} blog={b} />
          ))}
        </div>
      )}
      {blogs.length == 0 && (
        <div>We will have more blogs coming soon, stay tuned!</div>
      )}
    </div>
  );
}
