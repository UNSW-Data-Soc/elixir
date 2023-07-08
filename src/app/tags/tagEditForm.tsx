import React, { useState } from "react";

const TagEditForm = ({ tag, onSave }) => {
  const [name, setName] = useState(tag.name);
  const [color, setColor] = useState(tag.color);
  const colorOptions = [
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Orange', value: 'orange' },
    { label: 'Purple', value: 'purple' },
  ];

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
        <select
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        >
          <option value="">Select a color</option>
          {colorOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              style={{ backgroundColor: option.value }}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default TagEditForm;