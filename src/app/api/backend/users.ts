import { callFetch } from "./endpoints";

export interface User {
  email: string;
  name: string;
  photo_id: string | undefined;
  portfolio: boolean | undefined;
  id: string;
  access_level: "member" | "moderator" | "administrator";
  about: string;
  retired: boolean;
}

export interface AccessLevel {
  id: string;
  access_level: string;
}

const getAll: () => Promise<User[]> = async () => {
  return (await callFetch({
    route: "/users",
    method: "GET",
    authRequired: true,
  })) as User[];
};

const updateUserAccessLevel: (update: AccessLevel) => Promise<AccessLevel[]> = async (update: AccessLevel) => {
  return (await callFetch({
    route: "/access",
    method: "PUT",
    authRequired: true,
    body: JSON.stringify(update),
  })) as AccessLevel[];
};

export const users = {
  getAll,
  updateUserAccessLevel,
};
