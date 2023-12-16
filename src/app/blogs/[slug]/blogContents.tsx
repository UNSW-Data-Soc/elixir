import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { redirect } from "next/navigation";
import { generateHTML } from "@tiptap/html";
import { TIPTAP_EXTENSIONS } from "../tiptapExtensions";
import { Spinner, isModerator, parseBackendError } from "@/app/utils";
import { Tooltip } from "@nextui-org/tooltip";
import { api } from "@/trpc/server";
import { getServerAuthSession } from "@/server/auth";
dayjs.extend(relativeTime);

export default async function BlogContent({ slug }: { slug: string }) {
  const session = await getServerAuthSession();

  const blog = await api.blogs.getBySlug.query({ slug });

  // if (!blog) return <Spinner />; // TODO: handle NULL blog with server error message

  if (!isModerator(session) && !blog.public) {
    redirect("/auth/login");
  }

  const createdDate = dayjs(blog.createdTime);
  const editedDate = dayjs(blog.lastEditTime);

  const content = generateHTML(JSON.parse(blog.body), TIPTAP_EXTENSIONS);

  return (
    <main className="mx-auto px-10 py-12 sm:max-w-[80%] sm:px-0 md:max-w-[75%] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[40%]">
      <header className="flex flex-col gap-4">
        <h1 className="text-6xl font-light tracking-tighter">{blog.title}</h1>
        <p className="text-xl font-light text-[#555]">
          Written by <span className="italic">{blog.author}</span>
        </p>
        <div className="flex w-full flex-row justify-between">
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
