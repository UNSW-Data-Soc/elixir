import { callFetch } from './endpoints';

/** Returns a company when given the company's id */
const getCompany = async ({ id }: { id: string }) => {
  return await callFetch({
    route: '/company',
    method: 'GET',
    authRequired: false,
  });
};

/** Update a company's details */
const updateCompany = async ({
  name,
  photo_id,
  description,
  website_url,
}: {
  name: string;
  photo_id: string;
  description: string;
  website_url: string;
}) => {
  return await callFetch({
    route: '/company',
    method: 'PUT',
    authRequired: true,
    body: JSON.stringify({ name, photo_id, description, website_url }),
  });
};

/** Create a new company */
const createCompany = async ({
  name,
  photo_id,
  description,
  website_url,
}: {
  name: string;
  photo_id: string;
  description: string;
  website_url: string;
}) => {
  return await callFetch({
    route: '/company',
    method: 'POST',
    authRequired: true,
    body: JSON.stringify({ name, photo_id, description, website_url }),
  });
};

/** Returns all companies */
const getCompanies = async () => {
  return await callFetch({
    route: '/companies',
    method: 'GET',
    authRequired: false,
  });
};

/** Delete company */
const deleteCompany = async ({ id }: { id: string }) => {
  return await callFetch({
    route: '/company',
    method: 'DELETE',
    authRequired: true,
  });
};

/** Get sponsorship from id */
const getSponsorship = async ({ id }: { id: string }) => {
  return await callFetch({
    route: '/sponsorship',
    method: 'GET',
    authRequired: false,
  });
};

/** Update sponsorship */
// TODO: Check the time and the sponsorship type
const updateSponsorship = async ({
  message,
  sponsorship,
  company,
  expiration,
  id,
}: {
  message: string;
  sponsorship: string;
  company: string;
  expiration: string;
  id: string;
}) => {
  return await callFetch({
    route: '/sponsorship',
    method: 'PUT',
    authRequired: true,
    body: JSON.stringify({ message, sponsorship, company, expiration, id }),
  });
};
