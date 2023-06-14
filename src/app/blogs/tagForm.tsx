import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const TagForm = ({ onSubmit }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [color, setColor] = useState("");

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
      {/* Form inputs */}
    </form>
  );
};

export default TagForm;















/* /*return (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="color">Color:</label>
            <input
              type="text"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <button type="submit">Save</button>
        </form>
    );*/
