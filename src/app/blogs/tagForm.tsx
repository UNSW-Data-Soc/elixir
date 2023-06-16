"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const TagForm = ({ onSubmit }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [color, setColor] = useState("");

  const colorOptions = [
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Orange', value: 'orange' },
    { label: 'Purple', value: 'purple' },
  ];


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();


    if (!name || !color) {
      return;
    }

    const tag = {
      name,
      color,
    };

    onSubmit(tag);

    setName("");
    setColor("");

    router.push("/blogs");
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

export default TagForm;












