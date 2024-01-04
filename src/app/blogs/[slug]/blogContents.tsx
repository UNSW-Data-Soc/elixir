import { notFound, redirect } from "next/navigation";

import { Tooltip } from "@nextui-org/tooltip";

import { getServerAuthSession } from "@/server/auth";

import { api } from "@/trpc/server";

import { isModerator } from "@/app/utils";

import { generateHTML } from "@tiptap/html";

import { TIPTAP_EXTENSIONS } from "../tiptapExtensions";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default async function BlogContent({ slug }: { slug: string }) {
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
    <main className="mx-auto px-10 py-12 sm:max-w-[80%] sm:px-0 md:max-w-[75%] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[40%]">
      <header className="flex flex-col gap-4">
        <h1 className="text-4xl font-light tracking-tighter md:text-5xl">
          {blog.title}
        </h1>
        <p className="text-lg font-light text-[#555] sm:text-xl">
          Written by <span className="italic">{blog.author}</span>
        </p>
        <div className="flex w-full flex-row justify-between text-sm sm:text-base">
          <Tooltip content={createdDate.format("DD/MM/YYYY HH:mm")}>
            <p className="italic text-[#555]">
              Published {createdDate.fromNow()}
            </p>
          </Tooltip>
          <Tooltip content={editedDate.format("DD/MM/YYYY HH:mm")}>
            <p className="italic text-[#555]">Edited {editedDate.fromNow()}</p>
          </Tooltip>
        </div>
      </header>
      <div dangerouslySetInnerHTML={{ __html: content }} className="pt-8"></div>
    </main>
  );
}
