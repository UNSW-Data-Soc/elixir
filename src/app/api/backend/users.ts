import { BACKEND_URL, callFetch } from "./endpoints";

export type userLevels = "member" | "moderator" | "administrator";
export interface User {
  email: string;
  name: string;
  photo: boolean;
  id: string;
  access_level: userLevels;
  about: string;
  retired: boolean;
  registration_time: "2023-06-16T10:59:09.059Z";
  years_active: number[];
}

export interface UserPublic {
  name: string;
  photo: boolean;
  id: string;
  about: string;
  retired: boolean;
  years_active: number[];
}

interface UserUpdate {
  id: string;
  email?: string;
  name?: string;
  photo?: boolean;
  access_level?: userLevels;
  about?: string;
  retired?: boolean;
  registration_time?: "2023-06-16T10:59:09.059Z";
  years_active?: number[];
}

export interface AccessLevel {
  id: string;
  access_level: string;
}


async function get(user_id: string): Promise<UserPublic> {
  return (await callFetch({
    route: `/user/${user_id}`,
    method: "GET",
    authRequired: true,
  })) as UserPublic;
};

async function getInfo(user_id: string): Promise<User> {
  return (await callFetch({
    route: `/user/info/${user_id}`,
    method: "GET",
    authRequired: true,
  })) as User;
};

const getAll: () => Promise<UserPublic[]> = async () => {
  return (await callFetch({
    route: "/users",
    method: "GET",
    authRequired: true,
  })) as UserPublic[];
};

const getAllInfo: () => Promise<User[]> = async () => {
  return (await callFetch({
    route: "/users/info",
    method: "GET",
    authRequired: true,
  })) as User[];
};

async function updateUser(update: UserUpdate) {
  return (await callFetch({
    route: "/user",
    method: "PUT",
    authRequired: true,
    body: JSON.stringify(update),
  })) as User[];
};

async function updateProfile(user_id: string, email: string, name: string, about: string): Promise<User> {
  return (await callFetch({
    route: `/user`,
    method: "PUT",
    authRequired: true,
    body: JSON.stringify({
      id: user_id,
      email,
      name,
      about
    }),
  })) as User;
};


async function uploadProfilePicture(user_id: string, photo: Blob): Promise<{ id: string }> {
  const formData = new FormData();
  formData.append("user_id", user_id);
  formData.append("photo", photo);

  return await callFetch({
    route: `/file/user`,
    method: "POST",
    authRequired: true,
    body: formData
  }, false) as { id: string };
}

function getUserProfilePicture(user_id: string): string {
  return `${BACKEND_URL}/file/user?user_id=${user_id}`;
}

async function getYears(): Promise<number[]> {
  return (await callFetch({
    route: `/users/years`,
    method: "GET",
    authRequired: true,
  })) as number[];
};

async function getUsersByYears(year: Number): Promise<UserPublic[]> {
  return (await callFetch({
    route: `/users/year/${year}`,
    method: "GET",
    authRequired: true,
  })) as User[];
};


export const users = {
  get,
  getInfo,
  getAll,
  getAllInfo,
  updateUser,
  updateProfile,
  uploadProfilePicture,
  getUserProfilePicture,
  getYears,
  getUsersByYears,
};
