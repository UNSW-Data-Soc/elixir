import { notFound, redirect } from "next/navigation";

import { getServerAuthSession } from "@/server/auth";

import { api } from "@/trpc/server";

import { isModerator } from "@/app/utils";

import { generateHTML } from "@tiptap/html";

import { TIPTAP_EXTENSIONS } from "../tiptapExtensions";
import { getBlogExcerpt } from "../utils";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await api.blogs.getBySlug.query({ slug: params.slug });

  return {
    title: `${blog.title} | DataSoc`,
    description: getBlogExcerpt(JSON.parse(blog.body)),
    author: blog.author,
    date: blog.createdTime,
  };
}

export default async function BlogPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const session = await getServerAuthSession();

  let blog = null;
  try {
    blog = await api.blogs.getBySlug.query({ slug });
  } catch (e) {
    return notFound();
  }

  if (!isModerator(session) && !blog.public) {
    redirect("/auth/login");
  }

  const createdDate = dayjs(blog.createdTime);
  const editedDate = dayjs(blog.lastEditTime);

  const content = generateHTML(JSON.parse(blog.body), TIPTAP_EXTENSIONS);

  return (
    <div className="min-h-fit">
      <main className="mx-auto px-10 py-12 sm:max-w-[80%] sm:px-0 md:max-w-[75%] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[40%]">
        <header className="flex flex-col gap-4">
          <h1 className="text-4xl font-light leading-tight tracking-tighter md:text-5xl md:leading-tight">
            {blog.title}
          </h1>
          <p className="text-lg font-light text-[#555] sm:text-xl">
            Written by <span className="italic">{blog.author}</span>
          </p>
          <div className="flex w-full flex-row justify-between text-sm sm:text-base">
            {/* <Tooltip content={createdDate.format("DD/MM/YYYY HH:mm")}> */}
            <p className="italic text-[#555]">
              Published {createdDate.fromNow()}
            </p>
            {/* </Tooltip> */}
            {/* <Tooltip content={editedDate.format("DD/MM/YYYY HH:mm")}> */}
            <p className="italic text-[#555]">Edited {editedDate.fromNow()}</p>
            {/* </Tooltip> */}
          </div>
        </header>
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="pt-8"
        ></div>
      </main>
    </div>
  );
}
