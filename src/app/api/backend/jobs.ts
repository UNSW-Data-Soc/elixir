
import { BACKEND_URL, callFetch } from "./endpoints";

export interface Job {
    title: string,
    description: string,
    company: string,
    body: string,
    creator: string,
    expiration_time: string,
    id: string,
    photo: boolean,
    created_time: string,
    last_edit_time: string
}

export interface CreateJob {
    title: string,
    description: string,
    company: string,
    body: string,
    creator: string,
    expiration_time: string,
}

async function getAll(authRequired: boolean): Promise<Job[]> {
  return (await callFetch({
    route: "/jobs",
    method: "GET",
    authRequired: authRequired,
  })) as Job[];
};

function getJobPhoto(id: string): string {
  return `${BACKEND_URL}/file/job/${id}`;
}

async function create(job: CreateJob, photo: Blob | null): Promise<Job> {
    const formData = new FormData();
  
    formData.append("title", job.title);
    formData.append("description", job.description);
    formData.append("company", job.company);
    formData.append("body", job.body);
    formData.append("creator", job.creator);
    formData.append("expiration_time", job.expiration_time);
  
    if(photo) {
      formData.append("photo", photo);
    } else {
      throw new Error("Please attach a file");
    }
  
    return await callFetch({
      route: `/job`,
      method: "POST",
      authRequired: true,
      body: formData
    }, false);
  
  };

const remove: (id: string) => Promise<{id: string}> = async (id: string) => {
  return await callFetch({
    method: "DELETE",
    route: `/job?id=${id}`,
    authRequired: true,
  });
};

export const jobs = {
  getJobPhoto,
  getAll,
  create,
  remove,
};
