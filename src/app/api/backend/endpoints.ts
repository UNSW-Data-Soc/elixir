import { auth } from "./auth";
import { blogs } from "./blogs";
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

  console.log(session);
  console.log(body);

  const headers: HeadersInit = { "Content-Type": contentType };
  if (authRequired) headers["Authorization"] = `Bearer ${session?.user.token}`;

  try {
    const res = await fetch(`${BACKEND_URL}${route}`, { method, headers, body });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export const endpoints = {
  auth,
  blogs,
};
