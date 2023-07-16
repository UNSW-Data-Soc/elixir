'use client';
import {
  BuildingOfficeIcon,
  BanknotesIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import CompanyForm from '../companies/companyForm';
import { useSession } from 'next-auth/react';

export default function Companies() {
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  const session = useSession();

  const BACKEND_URL = 'http://127.0.0.1:8000';

  const demoCompany = {
    id: 1,
    name: 'NAB',
    icon: 'https://logos-world.net/wp-content/uploads/2021/02/NAB-Logo.png',
    url: 'https://www.nab.com.au/',
    description:
      'National Australia Bank is one of the four largest financial institutions in Australia in terms of market capitalisation, earnings and customers.',
  };

  const companies = [
    demoCompany,
    demoCompany,
    demoCompany,
    demoCompany,
    demoCompany,
  ];

  const fetchCompanies = async () => {
    console.log('fetching companies');
    const res = await fetch(`${BACKEND_URL}/company`);
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const deleteCompany = async (id) => {
    console.log('deleting company');
    const res = await fetch(`${BACKEND_URL}/company/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <main className='bg-white '>
      <header className='text-white p-12 bg-[#4799d1] flex flex-col gap-4'>
        <h1 className='text-3xl font-semibold'>Companies</h1>
        <p>Here are the companies DataSoc has collaborated with in the past</p>
        {session.status === 'authenticated' && (
          <div className='w-full flex flex-row gap-6 content-evenly'>
            <button
              onClick={() => setShowCompanyModal(true)}
              className='text-black py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 transition-all flex gap-3 flex-row'
            >
              <BuildingOfficeIcon className='h-6 w-6' />{' '}
              <span>Add Company</span>
            </button>
          </div>
        )}
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
                  deleteCompany(company.id);
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
