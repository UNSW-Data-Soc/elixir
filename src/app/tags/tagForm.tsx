import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Select from 'react-select';
import { Tag } from "../api/backend/tags";
import { endpoints } from "../api/backend/endpoints";
import { toast } from "react-hot-toast";


const TagForm = ({ onSubmit, onClose }: { onSubmit: (tag: Tag) => void, onClose: () => void }) => {
  const [name, setName] = useState("");
  const [colour, setColour] = useState("");
  const [showPopup, setShowPopup] = useState(true);


  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !colour) {
      return;
    }

    console.log('hi');
    const tag = await endpoints.tags.create({ name, colour });
    console.log('createdtag'+ tag);
    console.log('tag id' + tag.id); 
    console.log('tag name' + tag.name); 
    console.log('tag colour' + tag.colour); 


    if (!tag) {
      toast.error("Failed to create tag");
      return;
    }

   // const tag: Tag = { name, colour };
    
   onSubmit(tag);

    setName("");
    setColour("");
    setShowPopup(false);
  };

  const handleClose = () => {
    setShowPopup(false);
    onClose();
  };

  if (!showPopup) {
    return null; // Render nothing if showPopup is false
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center" style={{ zIndex: 9999 }}>
    <div className="bg-white p-12 rounded-xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={handleClose}
        >
          <FaTimes />
        </button>
        <h1 className="text-2xl font-semibold">Add Tag</h1>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 pb-3">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2 pb-3">
            <label htmlFor="colour">Colour:</label>
            <Select
              options={colorOptions}
              classNamePrefix="select"
              isSearchable={true}
              name="colour"
              value={colorOptions.find((option) => option.value === colour)}
              onChange={(selectedOption) => setColour(selectedOption?.value || "")}
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default TagForm;