'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import SponsorForm from './sponsorForm';
import { BanknotesIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Sponsorships() {
  const [showSponsorModal, setShowSponsorModal] = useState(false);

  const session = useSession();

  return (
    <main className='bg-white '>
      <header className='text-white p-12 bg-[#4799d1] flex flex-col gap-4'>
        <h1 className='text-3xl font-semibold'>Our Sponsors</h1>
        <p>
          DataSoc wouldn’t be DataSoc without the amazing companies we’ve worked
          with throughout our journey as a society. With more and more
          data-oriented decisions and predictions made everyday, the demand for
          talented Data Science graduates is growing.
        </p>
        <p>
          It’s our long term goal to help our members become as capable they can
          be, and it wouldn’t be possible without the continued support from
          industry.
        </p>
        <p>
          <strong>
            Interested in sponsoring? Reach out to{' '}
            <a href='mailto:external@unswdata.com'>external@unswdata.com</a>
          </strong>
        </p>
        {session.status === 'authenticated' && (
          <div className='w-full flex flex-row gap-6 content-evenly'>
            <button
              onClick={() => setShowSponsorModal(true)}
              className='text-black py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 transition-all flex gap-3 flex-row'
            >
              <BanknotesIcon className='h-6 w-6' /> <span>Add Sponsorship</span>
            </button>
          </div>
        )}
      </header>

      {showSponsorModal && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-10 rounded-xl'>
            <div className='flex justify-end'>
              <button onClick={() => setShowSponsorModal(false)}>
                <XMarkIcon className='h-6 w-6' />
              </button>
            </div>
            <h1 className='text-3xl font-semibold'>Add Sponsorship</h1>
            <p className='text-[#6a6a6a]'>
              Please fill out the form below to add a new sponsorship.
            </p>
            <SponsorForm />
          </div>
        </div>
      )}
    </main>
  );
}
