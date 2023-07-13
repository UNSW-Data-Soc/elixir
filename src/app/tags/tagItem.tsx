import React, { useState } from 'react';
import { Tag } from '../api/backend/tags';
import TagEditForm from './TagEditForm';

interface TagItemProps {
  tag: Tag;
  isAdmin: boolean;
  onUpdateTag: (updatedTag: Tag) => void; 
}

const TagItem: React.FC<TagItemProps> = ({ isAdmin, tag, onUpdateTag }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedTag, setEditedTag] = useState(tag);

  const handleTagClick = () => {
    if (isAdmin) {
      setShowEditForm(true);
    }
  };

  const handleSave = (updatedTag: Tag) => {
    setEditedTag(updatedTag); // Update the edited tag
    setShowEditForm(false);
    onUpdateTag(updatedTag);
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
  };

  const tagStyle = {
    backgroundColor: tag.colour,
    color: '#ffffff',
    padding: '5px 10px',
    borderRadius: '4px',
    margin: '5px',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    width: 'auto',
    fontSize: '12px', // Adjust the font size as needed
    cursor: 'pointer',
    position: 'relative',
    // Explicitly set the background color
    background: tag.colour,
  };

  const popupStyle = {
    position: 'absolute',
    top: 'calc(100% + 5px)', // Adjust the distance between the tag and the popup as needed
    left: '0',
    zIndex: '9999',
    backgroundColor: '#ffffff',
    padding: '10px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={tagStyle} onClick={handleTagClick}>
        {tag.name}
      </div>
      {showEditForm && (
        <div style={popupStyle}>
          <TagEditForm tag={editedTag} onSave={handleSave} />
          <button onClick={handleCancelEdit}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default TagItem;