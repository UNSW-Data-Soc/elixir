"use client";
import React, { useState } from "react";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import TagForm from './tagForm';
import TagEditForm from './tagEditForm';
import TagsAddCard from "./tagAddCard";
import { create } from "../api/backend/tags"; // Import the function to create a tag



export default function Tag() {

  const [tags, setTags] = useState([]);

   const [editingTagIndex, setEditingTagIndex] = useState(null); 
   const [showTagForm, setShowTagForm] = useState(false);

  
  const handleCreateTag = (tag) => {
    setTags([...tags, createdTag]);
    setShowTagForm(false);
  };

  const handleDeleteTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  const handleEditTag = (index) => {
    setEditingTagIndex(index);
  }

  const handleSaveTag = (updatedTag) => {
    const updatedTags = [...tags];
    updatedTags[editingTagIndex] = updatedTag;
    setTags(updatedTags);
    setEditingTagIndex(null);
    setShowTagForm(true);
  };
  
  const handleFormOpen = () => {
    setShowTagForm(true);
  };

  const handleFormClose = () => {
    setShowTagForm(false);
  };

  const handleButtonClick = () => {
    setShowTagForm(true);
  };

 // const router = useRouter();

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
      {showTagForm && (
        <div>
          <TagForm onSubmit={handleCreateTag} onClose={handleFormClose} />
        </div>
      )}
    </main>
  );
}