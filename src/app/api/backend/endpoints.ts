import { auth } from "./auth";
import { blogs } from "./blogs";
import { users } from "./users";
import { resources } from "./resources";
import { getSession } from "next-auth/react";

export const BACKEND_URL = "http://127.0.0.1:8000";

interface FetchArguments {
  route: string;
  method?: "GET" | "POST" | "DELETE" | "PUT";
  contentType?: string;
  body?: string | FormData | null;
  authRequired?: boolean;
}

export const callFetch = async ({
  route,
  method = "GET",
  contentType = "application/json",
  body = null,
  authRequired = false,
}: FetchArguments, setContentType=true) => {
  const session = await getSession();

  const headers: HeadersInit = setContentType ? { "Content-Type": contentType } : {};
  if (authRequired) headers["Authorization"] = `Bearer ${session?.user.token}`;

  const res = await fetch(`${BACKEND_URL}${route}`, { method, headers, body });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return await res.json();
};

export const endpoints = {
  auth,
  blogs,
  users,
  resources,
};
