import { getServerSession } from "next-auth";

import { Blog } from "../api/backend/blogs";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import BlogCardActions from "./blogCardActions";
import Link from "next/link";
dayjs.extend(relativeTime);

export default async function BlogCard(blog: Blog) {
  const session = await getServerSession();
  const createdDate = dayjs(Date.parse(blog.created_time)).fromNow();

  // const strippedBody = htmlToTextConvert(
  //   (Object.values(JSON.parse(blog.body)) as BlogBlock[])
  //     .filter((b) => b.type in textBlockTypes)
  //     .map((b) => b.content)
  //     .join("\n")
  // );

  return (
    <div className="border-[1px] border-black flex flex-col items-center w-4/12 hover:scale-105 hover:shadow-xl transition-all">
      <Link href={`/blogs/${blog.slug}`} className="w-full">
        <div
          className="w-full relative h-[200px]"
          style={{
            backgroundImage: "url(/adrian.jpeg)",
            backgroundOrigin: "content-box",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="flex flex-col gap-3 p-5 items-center">
          <h3 className="text-xl font-bold">{blog.title}</h3>
          <p className="">
            <span className="italic">{blog.author}</span>
            <span className="mx-3">|</span>
            <span>{createdDate}</span>
          </p>
          {/* <p className="text-[#555]">{strippedBody.substring(0, 200)}...</p> */}
          <BlogCardActions {...blog} />

          {/* {!!session && (
            <a href={`/blogs/editor/${blog.slug}`} className="text-blue-500 hover:underline">
              Edit
            </a>
          )}
          {!!session && !blog.public && <button className="text-red-500">Publish</button>}
          {!!session && !!blog.public && <button className="text-red-500">Unpublish</button>} */}
        </div>
      </Link>
    </div>
  );
}
