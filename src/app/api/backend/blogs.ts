import { randomUUID } from "crypto";
import { callFetch } from "./endpoints";

export interface Blog {
  creator: string;
  title: string;
  body: string;
  tags: String[]; // list of tag ids,
  author: string;
  public: true;
  id: string;
  created_time: "2023-06-16T10:59:09.059Z";
  last_edit_time: "2023-06-16T10:59:09.059Z";
}

const getAll: (authRequired: boolean) => Promise<Blog[]> = async (authRequired: boolean) => {
  return (await callFetch({
    route: "/blogs",
    method: "GET",
    authRequired: authRequired,
  })) as Blog[];
};

interface CreateBlog {
  title: string;
  author: string;
  body: string;
}
const create: (blog: CreateBlog) => Promise<Blog> = async (blog: CreateBlog) => {
  return await callFetch({
    method: "POST",
    route: "/blog",
    authRequired: true,
    body: JSON.stringify({ ...blog, public: true }),
  });
};

export const blogs = {
  getAll,
  create,
};
