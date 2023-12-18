import { redirect } from "next/navigation";

import { getToken } from "next-auth/jwt";
import { getSession, signOut } from "next-auth/react";

import { auth } from "./auth";
import { blogs } from "./blogs";
import { companies } from "./companies";
import { events } from "./events";
import { file } from "./file";
import { jobs } from "./jobs";
import { resources } from "./resources";
import { sponsorships } from "./sponsorships";
import { tags } from "./tags";
import { users } from "./users";

/**
 * @deprecated
 */
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface FetchArguments {
  route: string;
  method?: "GET" | "POST" | "DELETE" | "PUT";
  contentType?: string;
  body?: string | FormData | null;
  authRequired?: boolean;
}

export const callFetch = async (
  {
    route,
    method = "GET",
    contentType = "application/json",
    body = null,
    authRequired = false,
  }: FetchArguments,
  setContentType = true,
) => {
  return [];
  const session = await getSession();

  const headers: HeadersInit = setContentType
    ? { "Content-Type": contentType }
    : {};
  if (authRequired) headers["Authorization"] = `Bearer ${session?.user.token}`;

  const res = await fetch(`${BACKEND_URL}${route}`, { method, headers, body });

  if (!res.ok) {
    if (res.status === 401) {
      if (route === "/login" || route === "/register") {
        // can't remove token if it doesn't exist
        return await res.json();
      }
      if (session && session.user.token) {
        await signOut();
        return redirect("/auth/login");
      }
    }
    const err = await res.text();
    throw new Error(err);
  }

  return await res.json();
};

/**
 * @deprecated
 */
export const endpoints = {
  auth,
  blogs,
  tags,
  users,
  resources,
  file,
  companies,
  sponsorships,
  jobs,
  events,
};
