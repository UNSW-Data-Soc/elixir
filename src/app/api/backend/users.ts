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
  registration_time: "2023-06-16T10:59:09.059Z";
  years_active: number[];
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
  getAll,
  updateUserAccessLevel,
  updateYearsActive,
};
