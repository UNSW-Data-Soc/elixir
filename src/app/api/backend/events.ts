import { randomUUID } from "crypto";
import { callFetch } from "./endpoints";

export interface Event {
  creator: string;
  title: string;
  description: string;
  start_date: "2023-06-29T10:46:26.753Z";
  end_date: "2023-06-29T10:46:26.753Z";
  location: string;
  link: string;
  id: string;
  photo_id: string;
  last_edit_time: "2023-06-29T10:46:26.753Z"
}

const getAll: () => Promise<Event[]> = async () => {
  return (await callFetch({
    route: "/events",
    method: "GET",
    authRequired: false,
  })) as Event[];
};

interface CreateEvent {
  photo: string;
  creator: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  link: string;
}

const create: (event: CreateEvent) => Promise<Event> = async (event: CreateEvent) => {
  return await callFetch({
    method: "POST",
    route: "/event",
    authRequired: true,
    body: JSON.stringify({ ...event }),
  });
};

export const events = {
  getAll,
  create,
};
