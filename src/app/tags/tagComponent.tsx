"use client";
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { endpoints } from "../api/backend/endpoints";
import { Tag } from "../api/backend/tags";
import TagForm from "./tagForm";
import TagItem from "./tagItem";
import { useSession } from "next-auth/react";

const TagsComponent = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [showTagForm, setShowTagForm] = useState(false);
  let isAdmin = false; // Replace with actual admin check logic
  const session = useSession();


  if (session.status === "authenticated" && session.data.user.admin)  {
    isAdmin = true; 
  }

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await endpoints.tags.getAll();
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  /*const handleAddTag = async (tag: Tag) => {
    try {
      const createdTag = await endpoints.tags.create({
        name: tag.name,
        colour: tag.colour
      });
  
      // Update the tags list after successful creation
      const updatedTags = [...tags, createdTag];
      setTags(updatedTags);
      setShowTagForm(false);
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };*/

  const handleTagCreated = (tag: Tag) => {
    const updatedTags = [...tags, tag];
    setTags(updatedTags);
    setShowTagForm(false);
  };

  return (
    <div>
      <h2>Tags</h2>
      {tags.map((tag) => (
        <TagItem key={tag.id} tag={tag} />
      ))}
      {isAdmin && (
        <button onClick={() => setShowTagForm(true)}>Add Tag</button>
      )}
      {showTagForm && <TagForm onSubmit={handleTagCreated} />}
    </div>
  );
};  


export default TagsComponent;

/*export default function Tags() {
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
  
  