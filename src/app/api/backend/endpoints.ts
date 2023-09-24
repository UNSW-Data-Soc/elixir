import { auth } from "./auth";
import { blogs } from "./blogs";
import { tags } from "./tags";
import { users } from "./users";
import { resources } from "./resources";
import { file } from "./file";
import { getSession } from "next-auth/react";
import { companies } from "./companies";
import { sponsorships } from "./sponsorships";
import { jobs } from "./jobs";
import { getToken } from "next-auth/jwt";
import { logout } from "../auth/auth";
import { useRouter } from "next/navigation"; 
import { isTokenExpired } from "./isTokenExpired";

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
  setContentType = true
) => {

  const session = await getSession();
  const router = useRouter();



  // console.log(isTokenExpired(session.user.token));

   if (authRequired && session && !isTokenExpired(session.user.token)) {
    console.log("expired");
    handleTokenExpiration(router);
   }

   
  
  const headers: HeadersInit = setContentType ? { "Content-Type": contentType } : {};
  if (authRequired) headers["Authorization"] = `Bearer ${session?.user.token}`;

  const res = await fetch(`${BACKEND_URL}${route}`, { method, headers, body });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return await res.json();
};


// function for handling token expiration and redirection
const handleTokenExpiration = (router) => {
   // const router = useRouter();
    console.log("expired tokenn");
    logout();
    router.push("/auth/login");
};

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
};
