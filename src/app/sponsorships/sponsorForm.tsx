import React from 'react';
import { useSession } from 'next-auth/react';
import Select from 'react-select';

const SponsorForm = () => {
  return (
    <div>
      <div className='flex flex-col gap-2 pb-3'>
        <input
          className='py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none'
          type='text'
          placeholder='What is the name of the company?'
        />
      </div>
    </div>
  );
};

export default SponsorForm;
