import { endpoints } from "../api/backend/endpoints";
import { type Blog } from "../api/backend/blogs";

// import { convert as htmlToTextConvert } from "html-to-text";

import BlogsAddCard from "./blogsAddCard";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { getServerSession } from "next-auth";
import Link from "next/link";
// import { type BlogBlock, textBlockTypes } from "./editor/blogContentEditor";

export default function Blog() {
  return (
    <main className="bg-white ">
      <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p>
          Stay in the loop with our blog posts! From educational guides to opinion articles about
          data science in the real world, they&apos;re here for you!
        </p>
      </header>
      <p>
        TODO: Dialog for <b>tags</b> go here!
      </p>
      <BlogsContainer />
    </main>
  );
}

async function BlogsContainer() {
  let blogs = await endpoints.blogs.getAll();
  const session = await getServerSession();

  if (!session) blogs = blogs.filter((blog) => blog.public);

  return (
    <div className="container m-auto flex gap-8 p-10 flex-wrap justify-center">
      <BlogsAddCard />
      {!!blogs && blogs.map((blog) => <BlogCard key={blog.id} {...blog} />)}
    </div>
  );
}

async function BlogCard(blog: Blog) {
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
      <a href={`/blogs/${blog.slug}`} className="w-full">
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

          {!!session && (
            <a href={`/blogs/editor/${blog.slug}`} className="text-blue-500 hover:underline">
              Edit
            </a>
          )}
          {!blog.public && <p className="text-red-500">Publish</p>}
          {!!session && !!blog.public && <p className="text-red-500">Unpublish</p>}
        </div>
      </a>
    </div>
  );
}
