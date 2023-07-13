'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import SponsorForm from './sponsorForm';
import CompanyForm from './companyForm';
import {
  BuildingOfficeIcon,
  BanknotesIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function Sponsorships() {
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);

  const router = useRouter();
  const session = useSession();

  const demoCompany = {
    name: 'Google',
    icon: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    url: 'https://www.google.com',
    description:
      'Google is a multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware.',
  };

  const demoCompany2 = {
    name: 'Facebook',
    icon: 'https://www.facebook.com/images/fb_icon_325x325.png',
    url: 'https://www.facebook.com',
    description:
      'Facebook is an American online social media and social networking service based in Menlo Park, California, and a flagship service of the namesake company Facebook, Inc.',
  };

  const demoCompany3 = {
    name: 'Microsoft',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png',
    url: 'https://www.microsoft.com',
    description:
      'Microsoft Corporation is an American multinational technology company with headquarters in Redmond, Washington. It develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.',
  };

  const companies = [demoCompany2, demoCompany2, demoCompany2];

  // TODO: Get a list of all the companies and ids
  // pass this into sponsor form and the user can select the company which the sponsorship corresponds to
  // const [companies, setCompanies] = useState([]);

  // useEffect(() => {
  //   first;

  //   return () => {
  //     second;
  //   };
  // }, [third]);

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
      </header>

      {session.status === 'authenticated' && (
        <div className='w-full flex flex-row gap-6 content-evenly'>
          <button
            onClick={() => setShowCompanyModal(true)}
            className='py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 transition-all flex gap-3 flex-row'
          >
            <BuildingOfficeIcon className='h-6 w-6' /> <span>Add Company</span>
          </button>
          <button
            onClick={() => setShowSponsorModal(true)}
            className='py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 transition-all flex gap-3 flex-row'
          >
            <BanknotesIcon className='h-6 w-6' /> <span>Add Sponsorship</span>
          </button>
        </div>
      )}

      {showCompanyModal && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-10 rounded-xl'>
            <div className='flex justify-end'>
              <button onClick={() => setShowCompanyModal(false)}>
                <XMarkIcon className='h-6 w-6' />
              </button>
            </div>
            <h1 className='text-3xl font-semibold'>Add Company</h1>
            <p className='text-[#6a6a6a]'>
              Please fill out the form below to add a new company.
            </p>
            <CompanyForm />
          </div>
        </div>
      )}
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

      <div className='flex flex-col gap-6 p-12'>
        {companies.map((company) => (
          <div className='flex flex-col gap-3'>
            <div className='grid row-auto gap-3'>
              <img
                className='w-30
                p-4
                 rounded-full'
                src={company.icon}
                alt={company.name}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
