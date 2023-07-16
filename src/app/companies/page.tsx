'use client';
import {
  BuildingOfficeIcon,
  BanknotesIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import CompanyForm from '../companies/companyForm';

export default function Companies() {
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  const demoCompany = {
    id: 1,
    name: 'Google',
    icon: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    url: 'https://www.google.com',
    description:
      'Google is a multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware.',
  };

  const demoCompany2 = {
    id: 2,
    name: 'Facebook',
    icon: 'https://www.facebook.com/images/fb_icon_325x325.png',
    url: 'https://www.facebook.com',
    description:
      'Facebook is an American online social media and social networking service based in Menlo Park, California, and a flagship service of the namesake company Facebook, Inc.',
  };

  const demoCompany3 = {
    id: 3,
    name: 'Microsoft',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png',
    url: 'https://www.microsoft.com',
    description:
      'Microsoft Corporation is an American multinational technology company with headquarters in Redmond, Washington. It develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.',
  };

  const companies = [
    demoCompany,
    demoCompany2,
    demoCompany3,
    demoCompany,
    demoCompany,
  ];

  const fetchCompanies = async () => {
    const res = await fetch('api/company');
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <main className='bg-white '>
      <header className='text-white p-12 bg-[#4799d1] flex flex-col gap-4'>
        <h1 className='text-3xl font-semibold'>Companies</h1>
        <p>Here are the companies DataSoc has collaborated with in the past</p>
        <button
          onClick={() => setShowCompanyModal(true)}
          className='text-black py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 transition-all flex gap-3 flex-row'
        >
          <BuildingOfficeIcon className='h-6 w-6' /> <span>Add Company</span>
        </button>
      </header>

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
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 p-10'>
        {companies.map((company) => (
          <div
            className='flex flex-col gap-3 shadow rounded p-5'
            key={company.id}
          >
            <div className='flex justify-end'>
              <button
                className='items-end'
                onClick={() => {
                  console.log('delete');
                }}
              >
                <XMarkIcon className='h-6 w-6' />
              </button>
            </div>
            <img
              className='object-scale-down h-24 w-24'
              src={company.icon}
              alt={company.name}
            />
            <h1 className='text-2xl font-semibold'>{company.name}</h1>
            <p>{company.description}</p>
            <a className='text-blue-600' href={company.url}>
              {company.url}
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
