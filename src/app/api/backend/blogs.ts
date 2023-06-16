import { callFetch } from "./endpoints";

const getAll = async () => {
  return await callFetch({
    route: "/blogs",
    method: "GET",
    authRequired: false,
  });
};

export const blogs = {
  getAll,
};
