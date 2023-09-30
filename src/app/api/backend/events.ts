import { BACKEND_URL, callFetch } from "./endpoints";

export interface Event {
    creator: string,
    title: string,
    description: string,
    start_date: string,
    end_date: string,
    location: string,
    link: string,
    public: boolean,
    id: string,
    slug: string,
    photo: boolean,
    last_edit_time: string,
}

export interface CreateEvent {
    creator: string,
    title: string,
    description: string,
    start_date: string,
    end_date: string,
    location: string,
    link: string,
    public: boolean,
}

async function get(id: string) {
  return (await callFetch({
    route: `/event?id=${id}`,
    method: "GET",
    authRequired: false,
  })) as Event[];
};

const getAll: (authRequired: boolean) => Promise<Event[]> = async (authRequired: boolean) => {
  return (await callFetch({
    route: "/events",
    method: "GET",
    authRequired: authRequired,
  })) as Event[];
};


async function create(event: CreateEvent, file: Blob): Promise<Event> {
  const formData = new FormData();

  formData.append("creator", event.creator);
  formData.append("title", event.title);
  formData.append("description", event.description);
  formData.append("start_date", event.start_date);
  formData.append("end_date", event.end_date);
  formData.append("location", event.location);
  formData.append("link", event.link);
  formData.append("public", event.public ? "true" : "false");
  
  if(file) {
    formData.append("photo", file);
  } else {
    throw new Error("Please attach a file");
  }

  
  return await callFetch({
    route: `/event`,
    method: "POST",
    authRequired: true,
    body: formData
  }, false);

};

const remove: (id: string) => Promise<{id: string}> = async (id: string) => {
  return await callFetch({
    method: "DELETE",
    route: `/event?id=${id}`,
    authRequired: true,
  });
};

function getEventPhoto(id: string) {
  return `${BACKEND_URL}/file/event/${id}`;
}

async function updateVisibility(id: string, visible: boolean) {
  const formData = new FormData();

  formData.append("id", id);
  formData.append("public", visible ? "true" : "false");

  return await callFetch({
    method: "PUT",
    route: "/event",
    authRequired: true,
    body: formData
  }, false);
}

export const events = {
  get,
  getAll,
  create,
  remove,
  getEventPhoto,
  updateVisibility,
};
