import { randomUUID } from "crypto";
import { BACKEND_URL, callFetch } from "./endpoints";

export interface Company {
    name: string,
    website_url: string,
    description: string,
    photo: boolean,
    id: string
}


export interface CreateCompany {
    name: string,
    website_url: string,
    description: string,
}

async function get(id: string) {
  return (await callFetch({
    route: `/company?id=${id}`,
    method: "GET",
    authRequired: false,
  })) as Company[];
};

const getAll: () => Promise<Company[]> = async () => {
  return (await callFetch({
    route: "/companies",
    method: "GET",
    authRequired: false,
  })) as Company[];
};


async function create(company: CreateCompany, file: Blob): Promise<Company> {
  const formData = new FormData();

  formData.append("name", company.name);
  formData.append("website_url", company.website_url);
  formData.append("description", company.description);
  formData.append("photo", file);

  return await callFetch({
    route: `/company`,
    method: "POST",
    authRequired: true,
    body: formData
  }, false);

};

function getCompanyPhoto(id: string) {
  return `${BACKEND_URL}/file/company/${id}`;
}

const remove: (id: string) => Promise<{id: string}> = async (id: string) => {
  return await callFetch({
    method: "DELETE",
    route: `/company?id=${id}`,
    authRequired: true,
  });
};

export const companies = {
  get,
  getCompanyPhoto,
  getAll,
  create,
  remove,
};
