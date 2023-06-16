'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SponsorForm from './sponsorForm';

export default function Sponsorships() {
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();
  const session = useSession();

  return (
    <main className='bg-white '>
      <header className='text-white p-12 bg-[#4799d1] flex flex-col gap-4'>
        <h1 className='text-3xl font-semibold'>Our Sponsors</h1>
        <p>
          DataSoc wouldn’t be DataSoc without the amazing companies we’ve worked
          with throughout our journey as a society. With more and more
          data-oriented decisions and predictions made everyday, the demand for
          talented Data Science graduates is growing. It’s our long term goal to
          help our members become as capable they can be, and it wouldn’t be
          possible without the continued support from industry.
        </p>
      </header>

      {session.status === 'authenticated' && (
        <button
          onClick={() => setShowModal(true)}
          className='py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all'
        >
          + Add Sponsor
        </button>
      )}

      {showModal && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-12 rounded-xl'>
            <h1 className='text-3xl font-semibold'>Add Sponsor</h1>
            <p className='text-[#6a6a6a]'>
              Please fill out the form below to add a new sponsor.
            </p>
            <SponsorForm />
            <button
              className='py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all'
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <p>
        TODO: Dialog for <b>company</b> go here!
      </p>
    </main>
  );
}
