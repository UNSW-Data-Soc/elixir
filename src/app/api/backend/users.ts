import { callFetch } from "./endpoints";

export type userLevels = "member" | "moderator" | "administrator";
export interface User {
  email: string;
  name: string;
  photo_id: string | undefined;
  id: string;
  access_level: userLevels;
  about: string;
  retired: boolean;
  registration_time: "2023-06-16T10:59:09.059Z";
  years_active: number[];
}

export interface AccessLevel {
  id: string;
  access_level: string;
}


async function get(user_id: string): Promise<User> {
  return (await callFetch({
    route: `/user/${user_id}`,
    method: "GET",
    authRequired: true,
  })) as User;
};

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

async function updateYearsActive(user_id: string, years_active: number[]): Promise<User> {
  return (await callFetch({
    route: "/user",
    method: "PUT",
    authRequired: true,
    body: JSON.stringify({
      id: user_id,
      years_active: years_active,
    }),
  })) as User;
};

export const users = {
  get,
  getAll,
  updateUserAccessLevel,
  updateYearsActive,
};
