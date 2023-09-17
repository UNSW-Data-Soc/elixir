import { callFetch } from "./endpoints";
import { image } from "./file";
import { z } from "zod";

export interface Blog {
  creator: string;
  title: string;
  body: string;
  tags: String[]; // list of tag ids,
  author: string;
  public: boolean;
  id: string;
  slug: string;
  created_time: string;
  last_edit_time: string;
}

const validateBlog = (blog: any) => {
  const blogSchema = z.object({
    title: z.string(),
    body: z.string(),
    author: z.string(),
    public: z.boolean(),
    slug: z.string(),
    id: z.string(),
    creator: z.string(),
    created_time: z.string(),
    last_edit_time: z.string(),
  });
  return blogSchema.parse(blog);
};

const getAll: ({ authRequired }: { authRequired: boolean }) => Promise<Blog[]> = async ({
  authRequired,
}: {
  authRequired: boolean;
}) => {
  const res = await callFetch({
    route: "/blogs",
    method: "GET",
    authRequired,
  });
  return res.map(validateBlog);
};

interface CreateBlog {
  title: string;
  author: string;
  body: string;
  public: boolean;
}
const create = async (blog: CreateBlog) => {
  const res = await callFetch({
    method: "POST",
    route: "/blog",
    authRequired: true,
    body: JSON.stringify({ ...blog }),
  });
  return validateBlog(res);
};

const get = async ({ slug, authRequired = false }: { slug: string; authRequired?: boolean }) => {
  const res = await callFetch({
    route: `/blog?slug=${slug}`,
    method: "GET",
    authRequired,
  });
  return validateBlog(res);
};

const update = async ({
  title,
  body,
  author,
  id,
  blogPublic,
}: {
  title: string;
  body: string;
  author: string;
  id: string;
  blogPublic: boolean;
}) => {
  const res = await callFetch({
    route: `/blog`,
    method: "PUT",
    authRequired: true,
    body: JSON.stringify({ title, body, author, public: blogPublic, id }),
  });

  return validateBlog(res);
};

const deleteBlog = async ({ id }: { id: string }) => {
  const res = await callFetch({
    route: `/blog?id=${id}`,
    method: "DELETE",
    authRequired: true,
  });
  const resSchema = z.object({
    id: z.string(),
  });
  return resSchema.parse(res);
};

export const blogs = {
  get,
  getAll,
  create,
  image,
  update,
  deleteBlog,
};
