import React, { useState } from "react";

const TagEditForm = ({ tag, onSave }) => {
  const [name, setName] = useState(tag.name);
  const [color, setColor] = useState(tag.color);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !color) {
      return;
    }

    const updatedTag = { ...tag, name, color };
    onSave(updatedTag);

    setName("");
    setColor("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name: </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="color">Color: </label>
        <input
          type="text"
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default TagEditForm;