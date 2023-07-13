"use client";
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { FaPlus } from 'react-icons/fa';
import { endpoints } from "../api/backend/endpoints";
import { Tag } from "../api/backend/tags";
import TagForm from "./TagForm";
import TagItem from "./TagItem";
import { useSession } from "next-auth/react";

const TagsComponent = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [showTagForm, setShowTagForm] = useState(false);
  const session = useSession();
  let isAdmin = false; 

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

  const handleTagCreated = (tag: Tag) => {
    setTags([...tags, tag]);
    setShowTagForm(false);
  };

  const handleTagFormClose = () => {
    setShowTagForm(false);
  };

  return (
    <div>
      <h2 style={{ paddingLeft: '8px', marginTop: '8px', fontSize: '12px'}}>Tags:</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {tags.map((tag) => (
          <TagItem key={tag.id} tag={tag} />
        ))}
        {isAdmin && (
          <button onClick={() => setShowTagForm(true)} style={{ marginLeft: '8px' }}>
            <FaPlus />
          </button>
        )}
      </div>
      {showTagForm && <TagForm onSubmit={handleTagCreated} onClose={handleTagFormClose} />}
    </div>
  );
};

export default TagsComponent;

