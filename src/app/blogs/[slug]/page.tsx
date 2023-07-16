import { endpoints } from "@/app/api/backend/endpoints";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import BlogContent from "./blogContent";
import { BlogBlock } from "../editor/blogContentEditor";
dayjs.extend(relativeTime);

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const blog = await endpoints.blogs.get({ slug });

  const createdDate = dayjs(Date.parse(blog.created_time)).fromNow();
  const editedDate = dayjs(Date.parse(blog.last_edit_time)).fromNow();

  return (
    <main className="px-10 sm:px-0 sm:max-w-[80%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[40%] mx-auto py-12">
      <header className="flex flex-col gap-4">
        <h1 className="text-6xl font-light tracking-tighter">{blog.title}</h1>
        <p className="text-[#555] text-xl font-light">
          Written by <span className="italic">{blog.author}</span>
        </p>
        <div className="flex flex-row w-full justify-between">
          <p className="text-[#555] italic">Published {createdDate}</p>
          <p className="text-[#555] italic">Edited {editedDate}</p>
        </div>
      </header>
      <BlogContent
        content={(Object.values(JSON.parse(blog.body)) as BlogBlock[]).sort(
          (a, b) => a.order - b.order
        )}
      />
    </main>
  );
}
