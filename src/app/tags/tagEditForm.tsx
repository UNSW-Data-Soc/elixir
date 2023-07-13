"use client";
import React, { useState } from "react";
import Select from "react-select";
import { Tag } from "../api/backend/tags";

const TagEditForm = ({ tag, onSave }) => {
  const [name, setName] = useState(tag.name);
  const [color, setColor] = useState(tag.color);

  const colorOptions = [
    { label: 'Dark Blue', value: '#159BD6' },
    { label: 'Dark Purple', value: '#9E62A2' },
    { label: 'Red', value: '#E04552' },
    { label: 'Orange', value: '#EA6D38' },
    { label: 'Yellow', value: '#F5B102' },
    { label: 'Light Blue', value: '#98CEEA' },
    { label: 'Lavender', value: '#D0B0D0' },
    { label: 'Pink', value: '#F2A5A9' },
    { label: 'Coral', value: '#F5B89E' },
    { label: 'Light', value: '#FBD896' },

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

  const handleColorChange = (selectedOption) => {
    setColor(selectedOption.value);
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
        <Select
          options={colorOptions}
          classNamePrefix="select"
          isSearchable={true}
          id="color"
          value={colorOptions.find((option) => option.value === color)}
          onChange={handleColorChange}
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
};


export default TagEditForm;