"use client";
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { FaPlus } from 'react-icons/fa';
import { endpoints } from "../api/backend/endpoints";
import { Tag } from "../api/backend/tags";
import TagForm from "./tagForm";
import TagItem from "./tagItem";
import { useSession } from "next-auth/react";

const TagsComponent = (props: {
  tags?: Tag[],
  allowEditing: boolean,
  filterPredicate?: (t: Tag) => boolean
}) => {
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
        let tagsData: Tag[] = [];
        if(props.tags) {
          tagsData = props.tags;
          console.log("provided")
        } else {
          tagsData = await endpoints.tags.getAll();
          if(props.filterPredicate) {
            tagsData = tagsData.filter(props.filterPredicate);
          }
        }
        console.log("wtf")
        console.log(tagsData)
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, [props.tags]);

  const handleTagCreated = (tag: Tag) => {
    setTags([...tags, tag]);
    setShowTagForm(false);
  };

  const handleTagFormClose = () => {
    setShowTagForm(false);
  };

  const handleUpdateTag = (updatedTag: Tag) => {
    const updatedTags = tags.map((tag) => {
      if (tag.id === updatedTag.id) {
        return updatedTag; // Replace the original tag with the updated tag
      }
      return tag; // Keep the other tags unchanged
    });
    setTags(updatedTags);
  };

  const handleDelete = async (tagId: string) => {
    try {
      await endpoints.tags.deleteTag(tagId);
      setTags(tags.filter((tag) => tag.id !== tagId));
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {tags && tags.map((tag) => (
          <TagItem
            key={tag.id}
            tag={tag}
            allowEditing={props.allowEditing}
            isAdmin={isAdmin}
            onUpdateTag={handleUpdateTag}
            onDelete={handleDelete}
          />
        ))}
        {isAdmin && props.allowEditing && (
          <button onClick={() => setShowTagForm(true)} style={{ marginLeft: '8px' }}>
            <FaPlus />
          </button>
        )}
      </div>
      {showTagForm && props.allowEditing && <TagForm onSubmit={handleTagCreated} onClose={handleTagFormClose} />}
    </div>
  );
};

export default TagsComponent;


