import Image from "next/image";
import Link from "next/link";

import { CSSProperties } from "react";

import { Card, CardFooter } from "@nextui-org/card";

import { getServerAuthSession } from "@/server/auth";

import { api } from "@/trpc/server";
import { RouterOutputs } from "@/trpc/shared";

import { isModerator } from "../utils";
import BlogActionsModal from "./blogActionsModal";
import BlogCardActions from "./blogCardActions";
import { getFirstImageUrl } from "./utils";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default async function BlogsList() {
  const blogs = await api.blogs.getAll.query();

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 align-baseline">
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
    </>
  );
}

/**
 * given a blog, returns the CSS properties to apply to the blog card
 */
const getBlogCardStyle = (
  blog: RouterOutputs["blogs"]["getAll"][number],
): CSSProperties => {
  return blog.public
    ? {}
    : {
        opacity: 0.5,
      };
};

async function BlogCard({
  blog,
}: {
  blog: RouterOutputs["blogs"]["getAll"][number];
}) {
  const session = await getServerAuthSession();

  const editedDate = dayjs(blog.lastEditTime);

  const firstImage = getFirstImageUrl(JSON.parse(blog.body));

  return (
    <>
      <Link href={`/blogs/${blog.slug}`}>
        <Card
          className="aspect-[16/9] min-w-[20rem] sm:w-96 relative"
          style={getBlogCardStyle(blog)}
        >
          {/* TODO: use next/image */}
          <Image
            alt="blog post hero image"
            className={`z-0 h-full w-full ${
              firstImage.found ? "object-cover" : "object-contain"
            }`}
            src={firstImage.url}
            fill={true}
          />
          <CardFooter className="absolute bottom-0 flex w-full flex-col items-start justify-between gap-1 rounded-b-none bg-[#fffc] px-5 py-4">
            <div className="flex w-full flex-col items-start">
              <p className="text-lg font-bold">{blog.title}</p>
              <div className="flex w-full justify-between">
                <small className="text-default-500">
                  {`Authored by ${blog.author}`}
                </small>
                <small className="text-default-500">
                  {editedDate.fromNow()}
                </small>
              </div>
            </div>
            {isModerator(session) && (
              <div className="flex w-full items-center justify-center align-baseline">
                <BlogActionsModal blog={blog} />
                <BlogCardActions blog={blog} />
              </div>
            )}
          </CardFooter>
        </Card>
      </Link>
    </>
  );
}
