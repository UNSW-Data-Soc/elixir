"use client";
import React, { useState } from "react";
import TagForm from './tagForm';

export default function Blog() {

  const [tags, setTags] = useState([]);
  
  const handleCreateTag = (tag) => {
    setTags([...tags, tag]);
  };


  return (
    <main className="bg-white ">
      <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p>
          Stay in the loop with our blog posts! From educational guides to
          opinion articles about data science in the real world, they&apos;re
          here for you!
        </p>
      </header>
      <button style={{ backgroundColor: "red" }}>
        Add Blog (TODO: change this button to a clickable "+" card, only visible to mods/admins)
      </button>
      <TagForm onSubmit={handleCreateTag} />
      <div>
        <h2>Tags</h2>
        {tags.map((tag, index) => (
          <div key={index}>
            <span>Name: {tag.name}</span>
            <span>Color: {tag.color}</span>
          </div>
        ))}
      </div>
    </main>
  );
}


