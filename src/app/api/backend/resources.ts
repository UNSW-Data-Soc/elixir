import { randomUUID } from "crypto";
import { BACKEND_URL, callFetch } from "./endpoints";

export interface Resource {
  title: string;
  description: string;
  public: boolean;
  internal: boolean;
  id: string;
  link: string | null;
  created_time: "2023-06-16T10:59:09.059Z";
  last_edit_time: "2023-06-16T10:59:09.059Z";
}


export interface CreateResource {
  title: string;
  description: string;
  link: string | null;
  visibility: boolean;
}

const getInternalResource: (id: string) => Promise<string> = async (id: string) => {
  return `${BACKEND_URL}/file/resources/${id}`;
}

const getAll: () => Promise<Resource[]> = async () => {
  return (await callFetch({
    route: "/resources",
    method: "GET",
    authRequired: false,
  })) as Resource[];
};


async function create(resource: CreateResource, file: Blob | null): Promise<Resource> {
  const formData = new FormData();

  formData.append("title", resource.title);
  formData.append("description", resource.description);
  formData.append("public", resource.visibility ? "true" : "false");

  if(file) {
    formData.append("file", file);
  } else if(resource.link) {
    formData.append("link", resource.link);
  } else {
    throw new Error("Link nor file found");
  }

  return await callFetch({
    route: `/resource`,
    method: "POST",
    authRequired: true,
    body: formData
  }, false);

};

const remove: (id: string) => Promise<Resource> = async (id: string) => {
  return await callFetch({
    method: "DELETE",
    route: `/resource?id=${id}`,
    authRequired: true,
  });
};

async function updateVisibility(id: string, visible: boolean) {
  return await callFetch({
    method: "PUT",
    route: "/resource",
    authRequired: true,
    body: JSON.stringify({id: id, public: visible})
  })
}

export const resources = {
  getInternalResource,
  getAll,
  create,
  remove,
  updateVisibility,
};
