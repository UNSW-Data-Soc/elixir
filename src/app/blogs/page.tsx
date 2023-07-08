mport { endpoints } from "../api/backend/endpoints";
import { type Blog } from "../api/backend/blogs";
import TagForm from "./tagForm";
import { Tag } from "../api/backend/tags";
import BlogsAddCard from "./blogsAddCard";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import { remark } from "remark";
import strip from "strip-markdown";

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
  const blogs = await endpoints.blogs.getAll();

  return (
    <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
      <BlogsAddCard />
      {blogs.map((blog) => (
        <BlogCard key={blog.id} {...blog} />
      ))}
    </div>
  );
}

async function BlogCard(blog: Blog) {
  const createdDate = dayjs(Date.parse(blog.created_time)).fromNow();

  const strippedBody = String(await remark().use(strip).process(blog.body));

  return (
    <div className="border-[1px] border-black flex flex-col items-center w-4/12">
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
        <p className="text-[#555]">{strippedBody.substring(0, 200)}...</p>
      </div>
    </div>
  );
}
















/*
"use client";
import React, { useState } from "react";
import { endpoints } from "../api/backend/endpoints";


export default function Blog() {
  const [showTagForm, setShowTagForm] = useState(false);

  const handleButtonClick = () => {
    console.log("clicked"); 
    setShowTagForm(true);
  };

  const handleCreateTag = async (tag: Tag) => {
    // Perform any necessary API calls or state updates here
    await endpoints.tags.create(tag);
    setShowTagForm(false);
  };

  return (
    <main className="bg-white">
      <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p>
          Stay in the loop with our blog posts! From educational guides to opinion articles about data science in the real world, they&apos;re here for you!
        </p>
      </header>
      <button
        onClick={handleButtonClick}
        className="py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
      >
        + Create Tag
      </button>
      {showTagForm && <TagForm onSubmit={handleCreateTag} />}
    </main>
  );
}


*/


/*
export default function Blog() {
  const [tags, setTags] = useState([]);
  const [showTagForm, setShowTagForm] = useState(false);

  const handleButtonClick = () => {
    setShowTagForm(true);
  };

  const handleCreateTag = async (Tag) => {
    // Perform any necessary API calls or state updates here
    await endpoints.tags.create(tag);
    setTags([...tags, tag]);
    setShowTagForm(false);
  };

  return (
    <main className="bg-white">
      <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p>
          Stay in the loop with our blog posts! From educational guides to opinion articles about data science in the real world, they&apos;re here for you!
        </p>
      </header>
      <button
        onClick={handleButtonClick}
        className="py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
      >
        + Create Tag
      </button>
      {showTagForm && <TagForm onSubmit={handleCreateTag} />}
    </main>
  );
}*?


/*
async function TagsContainer() {
  const tags = await endpoints.tags.getAll();
  console.log("Tags: ", tags);

  return (
    <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
      <TagsAddCard />
      {tags?.map((tag) => (
        <div key={tag.id} className="tag">{tag.name}</div>
      ))}
    </div>
  );
}
*/






