import React, { useState } from "react";
import Select from "react-select";
import { Tag } from "../api/backend/tags";
import chroma from 'chroma-js';
import { endpoints } from "../api/backend/endpoints";

interface TagEditFormProps {
  tag: Tag;
  onSave: (updatedTag: Tag) => void;
  onDelete: () => void;
}

const TagEditForm: React.FC<TagEditFormProps> = ({ tag, onSave, onDelete }) => {
  const [name, setName] = useState(tag.name);
  const [colour, setColour] = useState(tag.colour);

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
    { label: 'Light Yellow', value: '#FBD896' },
  ];

  const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',
  
    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });

  const colourStyles: StylesConfig<OptionTypeBase> = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.value
          : isFocused
          ? data.value
          : undefined,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(data.value, 'white') > 2
            ? 'white'
            : 'black'
          : data.value,
        cursor: isDisabled ? 'not-allowed' : 'default',
  
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled ? data.value : undefined,
        },
      };
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot('#ccc') }),
    singleValue: (styles, { data }) => {
      return {
        ...styles,
        ...dot(data.value), // Display the dot with the selected color
      };
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !colour) {
      return;
    }

    const updatedTag: Tag = { ...tag, name, colour };
    onSave(updatedTag);

    setName("");
    setColour("");
  };

  const handleColourChange = (selectedOption: { value: string }) => {
    setColour(selectedOption.value);
  };

  const handleSave = async () => {
    const updatedTag: Tag = { ...tag, name, colour };
    try {
      const response = await endpoints.tags.update(updatedTag);
      console.log("Tag updated:", response);
      onSave(updatedTag); // Update the tag immediately
    } catch (error) {
      console.log("Error updating tag:", error);
      // Handle the error
    }
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '10px 0' }}>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="name" style={{ fontSize: '14px' }}>Name: </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            fontSize: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '5px',
          }}
        />
      </div>
      <div>
        <label htmlFor="colour" style={{ fontSize: '14px' }}>Colour: </label>
        <Select
          options={colorOptions}
          classNamePrefix="select"
          isSearchable={true}
          id="colour"
          value={colorOptions.find((option) => option.value === colour)}
          onChange={handleColourChange}
          styles={{
            control: (provided) => ({
              ...provided,
              fontSize: '12px', // Adjust the font size as needed
            }),
            menu: (provided) => ({
              ...provided,
              fontSize: '12px', // Adjust the font size as needed
            }),
            option: (provided) => ({
              ...provided,
              fontSize: '12px', // Adjust the font size as needed
            }),
            ...colourStyles, // Add the colourStyles here
          }}
        />
      </div>
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          className="py-1 px-2 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
        >
          Update
        </button>
        <button
          className="py-1 px-2 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
          onClick={() => handleDelete(tag)}
        >
          Delete
        </button>
      </div>
    </form>
  );
};

export default TagEditForm;

