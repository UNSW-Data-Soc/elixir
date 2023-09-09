import { Blog } from "../api/backend/blogs";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import BlogCardActions from "./blogCardActions";
import Link from "next/link";
import { BlogBlock } from "./editor/[slug]/page";
dayjs.extend(relativeTime);

import { convert } from "html-to-text";

export default function BlogCard(blog: Blog) {
  const createdDate = dayjs(Date.parse(blog.created_time)).fromNow();

  // get excerpt
  const content = JSON.parse(blog.body) as BlogBlock[];
  const paragraphBlocks = Object.values(content)
    .sort((a, b) => a.order - b.order)
    .map((b) => {
      if (b.type === "p") return b.content;
      else return "";
    })
    .join(" ");
  const blogExcerpt = convert(paragraphBlocks, {}).split(new RegExp(/\s/)).splice(0, 40).join(" ");

  // get image
  const image = Object.values(content).find((b) => b.type === "image" && b.url);
  const imageUrl = image ? image.url : "/kentosoc.jpeg";

  return (
    <div className="border-[1px] border-black flex flex-col items-center w-4/12 hover:scale-105 hover:shadow-xl transition-all">
      <Link href={`/blogs/${blog.slug}`} className="w-full">
        <div
          className="w-full relative h-[200px]"
          style={{
            backgroundImage: `url(${imageUrl})`,
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
          <p className="text-[#555]">{blogExcerpt}...</p>
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
