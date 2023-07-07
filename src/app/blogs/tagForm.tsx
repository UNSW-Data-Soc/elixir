import React, { useState } from "react";
import { endpoints } from "../api/backend/endpoints";
import { Tag } from "../api/backend/tags";

const TagForm = ({ onSubmit }: { onSubmit: (tag: Tag) => void }) => {
  const [name, setName] = useState("");
  const [colour, setColour] = useState("");

  const colorOptions = [
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Orange', value: 'orange' },
    { label: 'Purple', value: 'purple' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !colour) {
      return;
    }

    const tag: Tag = { name, colour };
    await endpoints.tags.create(tag);

    setName("");
    setColour("");
    onSubmit(tag);
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
        <label htmlFor="colour">Colour: </label>
        <select
          id="colour"
          value={colour}
          onChange={(e) => setColour(e.target.value)}
        >
          <option value="">Select a colour</option>
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

export default TagForm;





