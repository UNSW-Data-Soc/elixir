import React, { useState } from "react";
import { Tag } from "../api/backend/tags";
import { endpoints } from "../api/backend/endpoints";
import { toast } from "react-hot-toast";



const TagForm = ({ onSubmit }: { onSubmit: (tag: Tag) => void }) => {
  const [name, setName] = useState("");
  const [colour, setColour] = useState("");

  /*const colorOptions = [
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Orange', value: 'orange' },
    { label: 'Purple', value: 'purple' },
  ];*/
  const colorOptions = [
    { label: 'Red', value: '#FF0000' },
    { label: 'Blue', value: '#0000FF' },
    { label: 'Green', value: '#00FF00' },
    { label: 'Yellow', value: '#FFFF00' },
    { label: 'Orange', value: '#FFA500' },
    { label: 'Purple', value: '#800080' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !colour) {
      return;
    }

    console.log('hi');
    const tag = await endpoints.tags.create({ name, colour });
    console.log('createdtag'+ tag);

    if (!tag) {
      toast.error("Failed to create tag");
      return;
    }

   // const tag: Tag = { name, colour };
    //await onSubmit(tag);

    setName("");
    setColour("");
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
