import { randomUUID } from "crypto";
import { callFetch } from "./endpoints";
import { image } from "./file";
import { z } from "zod";

export interface Blog {
  creator: string;
  title: string;
  body: string;
  author: string;
  public: true;
  id: string;
  created_time: "2023-06-16T10:59:09.059Z";
  last_edit_time: "2023-06-16T10:59:09.059Z";
}

const getAll: () => Promise<Blog[]> = async () => {
  return (await callFetch({
    route: "/blogs",
    method: "GET",
    authRequired: false,
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

const get = async ({ blogId }: { blogId: string }) => {
  const res = await callFetch({
    route: `/blog?id=${blogId}`,
    method: "GET",
    authRequired: false,
  });

  const blogSchema = z.object({
    title: z.string(),
    body: z.string(),
    author: z.string(),
    public: z.boolean(),
    id: z.string(),
    creator: z.string(),
    created_time: z.string(),
    last_edit_time: z.string(),
  });
  return blogSchema.parse(res);
};

const update = async ({
  title,
  body,
  author,
  id,
}: {
  title: string;
  body: string;
  author: string;
  id: string;
}) => {
  return await callFetch({
    route: `/blog`,
    method: "PUT",
    authRequired: true,
    body: JSON.stringify({ title, body, author, public: true, id }),
  });
};

export const blogs = {
  get,
  getAll,
  create,
  image,
  update,
};
