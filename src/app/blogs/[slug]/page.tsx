"use client";

import { endpoints } from "@/app/api/backend/endpoints";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { redirect, useRouter } from "next/navigation";
import { generateHTML } from "@tiptap/html";
import { TIPTAP_EXTENSIONS } from "../tiptapExtensions";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Blog } from "@/app/api/backend/blogs";
import toast from "react-hot-toast";
import { Spinner, parseBackendError } from "@/app/utils";
import { Tooltip } from "@nextui-org/react";
dayjs.extend(relativeTime);

export default function BlogPage({ params }: { params: { slug: string } }) {
  const session = useSession();
  const router = useRouter();

  const slug = params.slug;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBlog = async () =>
      await endpoints.blogs.get({
        slug,
        authRequired: session.status === "authenticated",
      });

    getBlog()
      .then((blog) => setBlog(blog))
      .catch((err) => {
        toast.error(parseBackendError(err));
        router.push("/");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session.status, slug]);

  if (!blog) return <></>; // TODO: handle NULL blog with server error message

  if (session.status !== "authenticated" && !blog.public) {
    return router.push("/auth/login");
  }

  const createdDate = dayjs(Date.parse(blog.created_time));
  const editedDate = dayjs(Date.parse(blog.last_edit_time));

  const content = generateHTML(JSON.parse(blog.body), TIPTAP_EXTENSIONS);

  return (
    <main className="mx-auto px-10 py-12 sm:max-w-[80%] sm:px-0 md:max-w-[75%] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[40%]">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <header className="flex flex-col gap-4">
            <h1 className="text-6xl font-light tracking-tighter">
              {blog.title}
            </h1>
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
                <p className="italic text-[#555]">
                  Edited {editedDate.fromNow()}
                </p>
              </Tooltip>
            </div>
          </header>
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            className="pt-8"
          ></div>
        </>
      )}
    </main>
  );
}
