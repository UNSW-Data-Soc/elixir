import { getSession, signIn } from "next-auth/react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

interface LoginCredentials {
  email: string;
  password: string;
}
interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

interface Session {
  access_token: string;
  token_type: "bearer";
}

export const authRegister: ({
  email,
  password,
  name,
}: RegisterCredentials) => Promise<string> = async ({
  email,
  password,
  name,
}) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        password,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    console.log(await res.json());

    const a = await signIn("credentials", { email, password });

    return "ok";
  } catch (error) {
    const errMessage = JSON.parse((error as any).message).detail;
    toast.error(errMessage);
    throw new Error(errMessage);
  }
};

export const login: ({
  email,
  password,
}: LoginCredentials) => Promise<string> = async ({
  email,
  password,
}: LoginCredentials) => {
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
    const session: Session = await res.json();
    return session.access_token;
  } catch (error) {
    let errorMessage = JSON.parse((error as any).message).detail;
    if (!(typeof errorMessage === "string")) {
      errorMessage = JSON.stringify(errorMessage);
    }
    // toast.error(errorMessage);

    throw new Error(errorMessage);
  }
};

/**
 * @param session current user session; defaults to the value of the current_user_cookie
 * @returns whether logout was successful
 */
export const logout: () => Promise<boolean> = async () => {
  const session = await getSession();

  if (!session) {
    return false;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    await signOut();

    return true;
  } catch (error) {
    return false;
  }
};
