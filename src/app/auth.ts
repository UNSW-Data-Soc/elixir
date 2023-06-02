import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

interface LoginCredentials {
  email: string;
  password: string;
}

interface Session {
  access_token: string;
  token_type: "bearer";
}

const CURRENT_USER_COOKIE = "currentUser";

export const login: ({
  email,
  password,
}: LoginCredentials) => Promise<boolean> = async ({
  email,
  password,
}: LoginCredentials) => {
  toast.dismiss();

  if (email.length === 0) {
    toast.error("Please enter your email.");
    return false;
  }
  if (password.length === 0) {
    toast.error("Please enter your password.");
    return false;
  }

  const formBodyStrings: string[] = [];
  formBodyStrings.push("username=" + encodeURIComponent(email));
  formBodyStrings.push("password=" + encodeURIComponent(password));
  let formBody = formBodyStrings.join("&");

  try {
    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formBody,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }
    const session = await res.json();
    Cookies.set(CURRENT_USER_COOKIE, JSON.stringify(session));
    toast.success("Login success!");

    return true;
  } catch (error) {
    let errorMessage = JSON.parse((error as any).message).detail;
    if (!(typeof errorMessage === "string")) {
      errorMessage = JSON.stringify(errorMessage);
    }
    toast.error(errorMessage);

    return false;
  }
};

export const useSession = () => {
  const [user, setUser] = useState<Session | null>(null);

  useEffect(() => {
    const currentUser = Cookies.get(CURRENT_USER_COOKIE);
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  return user;
};

/**
 * @param session current user session; defaults to the value of the current_user_cookie
 * @returns whether logout was successful
 */
export const logout: (session: Session) => Promise<boolean> = async (
  session: Session = JSON.parse(Cookies.get(CURRENT_USER_COOKIE) ?? "")
) => {
  toast.dismiss();

  if (!session) {
    return false;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    Cookies.remove(CURRENT_USER_COOKIE);

    toast.success("Logout success!");

    return true;
  } catch (error) {
    toast.error(JSON.parse((error as any).message).detail);

    return false;
  }
};
