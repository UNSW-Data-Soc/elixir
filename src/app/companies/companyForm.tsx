import React from 'react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const CompanyForm = () => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const { data: session, status } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let form = new FormData();
    form.append('icon', icon);
    form.append('url', url);
    form.append('description', description);
    form.append('name', name);
    const res = await fetch('/api/company', {
      method: 'POST',
      headers: {
        authRequired: true,
        accessToken: token,
      },
      body: form,
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
          className='my-2 py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none'
          type='text'
          placeholder='Company Name'
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <input
          className='my-2 py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none'
          type='text'
          placeholder='Company Icon'
          onChange={(e) => setIcon(e.target.value)}
        />
        <br />
        <input
          className='my-2 py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none'
          type='text'
          placeholder='Company URL'
          onChange={(e) => setUrl(e.target.value)}
        />
        <br />
        <input
          className='my-2 py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none'
          type='text'
          placeholder='Company Description'
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
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
