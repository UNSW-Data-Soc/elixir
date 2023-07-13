import React from 'react';
import { useState } from 'react';

const CompanyForm = () => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  // // send data to backend using callFetch
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  // };
  //   console.log(data);
  // };

  return (
    <div>
      <form
        onSubmit={() => {
          console.log('clicked');
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
