import { auth } from "./auth";

const BACKEND_URL = "http://127.0.0.1:8000";

interface FetchArguments {
  route: string;
  method?: "GET" | "POST" | "DELETE" | "PUT";
  contentType?: string;
  body?: string | null;
  accessToken?: string;
  authRequired?: boolean;
}

export const callFetch = async ({
  route,
  method = "GET",
  contentType = "application/json",
  body = null,
  accessToken,
  authRequired = false,
}: FetchArguments) => {
  const headers: HeadersInit = { "Content-Type": contentType };
  if (authRequired) headers["Authorization"] = `Bearer ${accessToken}`;

  return await fetch(`${BACKEND_URL}${route}`, { method, headers, body });
};

export const endpoints = {
  auth,
};
