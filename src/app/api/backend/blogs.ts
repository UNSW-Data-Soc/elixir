import { callFetch } from "./endpoints";

const getAllBlogs = async () => {
  return await callFetch({
    route: "/blogs",
    method: "GET",
    authRequired: false,
  });
};

export const blogs = {
  getAllBlogs,
};
