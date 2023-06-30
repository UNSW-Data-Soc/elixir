'use client';

import React, { useState } from 'react';
import Select from 'react-select';
import { User } from '../api/backend/users';
import { endpoints } from '../api/backend/endpoints';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function UserDialogueInfo(props: {user: User, closeModal: Function}) {
  const router = useRouter();

  const [accessLevel, setAccessLevel] = useState<string>(props.user.access_level);
  
  async function handlePermissionChangeConfirmation() {
    const access_level_updated = await endpoints.users.updateUserAccessLevel({
      id: props.user.id,
      access_level: accessLevel
    });

    if (access_level_updated) {
      router.push("/users");
      toast.success("Updated user permission.");
    } else {
      toast.error("Failed to update user permissions.");
      return;
    }
  }

  let permissionsOptions =[
    { value: 'member', label: 'Member', isDisabled: props.user.access_level === "member"},
    { value: 'moderator', label: 'Moderator', isDisabled: props.user.access_level === "moderator" },
    { value: 'administrator', label: 'Administrator', isDisabled: props.user.access_level === "administrator" },
  ];

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
    <div className='bg-white p-12 rounded-xl'>
      <h1 className='text-2xl font-semibold'>Update {props.user.name}'s permissions</h1>
      <br></br>
      <div>
      <div className='flex flex-col gap-2 pb-3'>
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
        />        
      </div>
    </div>

      <button
        className='py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all'
        onClick={() => {handlePermissionChangeConfirmation(); props.closeModal();}}
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