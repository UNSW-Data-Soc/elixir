import React from 'react';
import { Tag } from '../api/backend/tags';

interface TagItemProps {
  tag: Tag;
}

const TagItem: React.FC<TagItemProps> = ({ tag }) => {
  const tagStyle = {
    backgroundColor: tag.colour,
    color: '#ffffff',
    padding: '5px 10px',
    borderRadius: '4px',
    margin: '5px',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    width: 'auto',
  };

  return (
    <div style={tagStyle}>
      {tag.name}
    </div>
  );
};

export default TagItem;