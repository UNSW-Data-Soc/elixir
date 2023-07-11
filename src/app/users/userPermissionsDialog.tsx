'use client';

import React, { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { User } from '../api/backend/users';
import { endpoints } from '../api/backend/endpoints';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function UserDialogueInfo(props: {user: User, closeModal: Function}) {
  const router = useRouter();

  const [accessLevel, setAccessLevel] = useState<string>(props.user.access_level);
  const [year, setYear] = useState<string>('');
  const [yearsActive, setYearsActive] = useState<MultiValue<{ label: number; value: number; }>>([]);
  
  useEffect(() => {
    let newYearsActive =  [];
    for(let y of props.user.years_active) {
      newYearsActive.push(createOption(y));
    }
    setYearsActive(newYearsActive);
  }, [props.user]);
  
  async function handleConfirm() {
    // if access level actually changed
    if(accessLevel !== props.user.access_level) {
      const access_level_updated = await endpoints.users.updateUserAccessLevel({
        id: props.user.id,
        access_level: accessLevel
      });

      if (!access_level_updated) {
        toast.error("Failed to update user permissions");
        return;
      }
    }

    let updated_years_active_arr = yearsActive.map(mv => mv.value);

    // if years active actually changed
    if(updated_years_active_arr.sort() !== props.user.years_active.sort()) {
      let updated_user = await endpoints.users.updateYearsActive(props.user.id, updated_years_active_arr);
      if(!updated_user) {
        toast.error("Failed to update user permissions");
        return;
      }
    }
    
    router.push("/users");
    toast.success("Updated user permissions");
  }

  const createOption = (label: number) => ({
    label,
    value: label,
  });

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!year) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if(isNaN(+year) || +year < 1000 || +year > 9999) {
          toast.error("Please enter a valid year");
          return;
        } else if(yearsActive.map(mv => mv.value).indexOf(+year) !== -1) {
          toast.error("Year already exists");
          return;
        }
        let new_years = [...yearsActive, createOption(+year)];
        setYearsActive(new_years);
        setYear('');
        event.preventDefault();
    }
  };

  let permissionsOptions =[
    { value: 'member', label: 'Member', isDisabled: props.user.access_level === "member"},
    { value: 'moderator', label: 'Moderator', isDisabled: props.user.access_level === "moderator" },
    { value: 'administrator', label: 'Administrator', isDisabled: props.user.access_level === "administrator" },
  ];

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
    <div className='bg-white p-12 rounded-xl'>
      <p className='text-2xl font-semibold'>{props.user.name}</p>
      <p className='text-1xl font'>{props.user.email}</p>
      <br></br>
      <hr/>
      <br></br>
      <div>
      <div className='flex flex-col gap-2 pb-3'>
        <p className='text-2xl font-semibold py-5'>Change user type</p>
        <Select
          options={permissionsOptions}
          classNamePrefix="select"
          isSearchable={true}
          name="accessLevel"
          onChange={
            (value) => {
              if(value) {
                setAccessLevel(value.value);
              }
            }
          }
          defaultValue={
            {
              value: accessLevel,
              label: accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1),
              isDisabled: true
            }
          }
        />
        <p className='text-2xl font-semibold py-5'>Update years active</p>
        <CreatableSelect
          components={{DropdownIndicator: null}}
          inputValue={year.toString()}
          isClearable
          isMulti
          menuIsOpen={false}
          onChange={newVal => setYearsActive(newVal)}
          onInputChange={newVal => setYear(newVal)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a year and press enter..."
          value={yearsActive}
      />
      </div>
    </div>

      <button
        className='py-2 px-4 mr-2 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all'
        onClick={() => {handleConfirm(); props.closeModal();}}
      >
        Confirm
      </button>
      <button
        className='py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all'
        onClick={() => props.closeModal()}
      >
        Cancel
      </button>
    </div>
  </div>
  );
};