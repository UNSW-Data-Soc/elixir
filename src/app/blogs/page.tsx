"use client";
import React, { useState } from "react";
import TagForm from './tagForm';
import TagEditForm from './tagEditForm';


export default function Blog() {

  const [tags, setTags] = useState([]);

   const [editingTagIndex, setEditingTagIndex] = useState(null); 
  
  const handleCreateTag = (tag) => {
    setTags([...tags, tag]);
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
  };

  
  return (
    <main className="bg-white">
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
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>
              {tag.name}
            </span>
            <div
              style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                backgroundColor: tag.color,
              }}
            />
            <button
              style={{ marginLeft: '8px' }}
              onClick={() => handleDeleteTag(index)}
            >
              Delete
            </button>
            <button
              style={{ marginLeft: '8px' }}
              onClick={() => handleEditTag(index)}
            >
              Modify
            </button>
          </div>
        ))}
      </div>
      {editingTagIndex !== null && (
        <TagEditForm
          tag={tags[editingTagIndex]}
          onSave={handleSaveTag}
        />
      )}
    </main>
  );
}