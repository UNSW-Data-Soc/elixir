import React from 'react';
import { Tag } from '../api/backend/tags';

interface TagItemProps {
  tag: Tag;
}

const TagItem: React.FC<TagItemProps> = ({ tag }) => {
  console.log("in tag item");
  return (
    <div>
      <h3>{tag.name}</h3>
      <p>{tag.colour}</p>
      {/* Additional tag information and actions can be rendered here */}
    </div>
  );
};

export default TagItem;