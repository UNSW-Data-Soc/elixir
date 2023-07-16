import React from 'react';
import { useState } from 'react';

const CompanyForm = () => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authRequired: true,
        accessToken: token,
      },
      body: JSON.stringify({ name, icon, url, description }),
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <form
        onSubmit={() => {
          handleSubmit;
        }}
        noValidate
      >
        <input
          className='py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none'
          type='text'
          placeholder='Company Name'
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className='py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none'
          type='text'
          placeholder='Company Icon'
          onChange={(e) => setIcon(e.target.value)}
        />
        <input
          className='py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none'
          type='text'
          placeholder='Company URL'
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          className='py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none'
          type='text'
          placeholder='Company Description'
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className='py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all'
          type='submit'
          value='Add Company'
        />
      </form>
    </div>
  );
};

export default CompanyForm;
