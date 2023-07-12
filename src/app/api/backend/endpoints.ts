import { auth } from "./auth";
import { blogs } from "./blogs";
import {tags} from "./tags"
import { getSession } from "next-auth/react";

const BACKEND_URL = "http://127.0.0.1:8000";

interface FetchArguments {
  route: string;
  method?: "GET" | "POST" | "DELETE" | "PUT";
  contentType?: string;
  body?: string | null;
  authRequired?: boolean;
}

export const callFetch = async ({
  route,
  method = "GET",
  contentType = "application/json",
  body = null,
  authRequired = false,
}: FetchArguments) => {
  const session = await getSession();

  const headers: HeadersInit = { "Content-Type": contentType };
  if (authRequired) headers["Authorization"] = `Bearer ${session?.user.token}`;

  try {
    const res = await fetch(`${BACKEND_URL}${route}`, { method, headers, body });
    console.log("made it up to here");
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    return await res.json();
  } catch (error) {
    console.log(error);
  }

  console.log("made it up to here 2");

};

export const endpoints = {
  auth,
  blogs,
  tags
};
