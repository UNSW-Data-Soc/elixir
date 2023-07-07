"use client";
import React, { useState } from "react";
import { endpoints } from "../api/backend/endpoints";
import TagForm from "./tagForm";
import { Tag } from "../api/backend/tags";

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






