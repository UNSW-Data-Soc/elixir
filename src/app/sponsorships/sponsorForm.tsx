import React from 'react';
import { useSession } from 'next-auth/react';
import Select from 'react-select';

const SponsorForm = () => {
  const options = [
    { value: 'chocolate', label: 'NAB' },
    { value: 'strawberry', label: 'Quantium' },
    { value: 'vanilla', label: 'Atlassian' },
  ];
  return (
    <div>
      <div className='flex flex-col gap-2 pb-3'>
        <Select options={options} />
        <input
          className='py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none'
          type='text'
          placeholder='Sponsorship Description'
        />  
      </div>
    </div>
  );
};

export default SponsorForm;
