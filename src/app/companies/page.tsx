'use client';
import { BuildingOfficeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import CompanyForm from '../companies/companyForm';
import { useSession } from 'next-auth/react';

export default function Companies() {
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const session = useSession();
  const BACKEND_URL = 'http://localhost:8000';

  const fetchCompanies = async () => {
    const res = await fetch(`${BACKEND_URL}/companies`);
    const data = await res.json();
    setCompanies(data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const deleteCompany = async (id: string) => {
    await fetch(`${BACKEND_URL}/company?id=${id}`, {
      method: 'DELETE',
    });
    setCompanies(companies.filter((company) => company.id !== id));
  };

  return (
    <main className='bg-white '>
      <header className='text-white p-12 bg-[#4799d1] flex flex-col gap-4'>
        <h1 className='text-3xl font-semibold'>Companies</h1>
        <p>Here are the companies DataSoc has collaborated with in the past</p>
        <div className='w-full flex flex-row gap-6 content-evenly'>
          <button
            onClick={() => setShowCompanyModal(true)}
            className='text-black py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 transition-all flex gap-3 flex-row'
          >
            <BuildingOfficeIcon className='h-6 w-6' /> <span>Add Company</span>
          </button>
        </div>
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
              src={company.photo_id}
              alt={company.name}
            />
            <h1 className='text-2xl font-semibold'>{company.name}</h1>
            <p>{company.description}</p>
            <a className='text-blue-600' href={company.website_url}>
              {company.website_url}
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
