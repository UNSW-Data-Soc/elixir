import { SignInResponse, getSession, signIn } from "next-auth/react";
import { signOut } from "next-auth/react";
import { endpoints } from "../../backend/endpoints";

interface LoginCredentials {
  email: string;
  password: string;
}
interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

interface RegisterResponse {
  error: string | null;
  ok: boolean;
}

interface Session {
  access_token: string;
  token_type: "bearer";
}

export const authRegister: (credentials: RegisterCredentials) => Promise<RegisterResponse> = async (
  credentials
) => {
  try {
    const res = await endpoints.auth.register(credentials);

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: JSON.parse(err).detail };
    }

    return { ok: true, error: null };
  } catch (error) {
    const errMessage = JSON.parse((error as any).message).detail;

    return { ok: false, error: errMessage };
  }
};

export const login: (credentials: LoginCredentials) => Promise<string> = async (
  credentials: LoginCredentials
) => {
  try {
    const res = await endpoints.auth.login(credentials);

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

    throw new Error(errorMessage);
  }
};

/**
 * @param session current user session; defaults to the value of the current_user_cookie
 * @returns whether logout was successful
 */
export const logout: () => Promise<boolean> = async () => {
  const session = await getSession();

  await signOut();

  if (!session) {
    return false;
  }

  try {
    const res = await endpoints.auth.logout();

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    return true;
  } catch (error) {
    return false;
  }
};
