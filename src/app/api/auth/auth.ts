import { getSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { endpoints } from "../backend/endpoints";

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

interface Jwt {
  id: string;
  exp: number;
  iat: number;
  nbf: string;
  access_level: "member" | "administrator";
}

function parseJwt(token: string): Jwt {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

export const authRegister: (credentials: RegisterCredentials) => Promise<RegisterResponse> = async (
  credentials
) => {
  try {
    await endpoints.auth.register(credentials);

    return { ok: true, error: null };
  } catch (error) {
    const errMessage = JSON.parse((error as any).message).detail;

    return { ok: false, error: errMessage };
  }
};

export const login: (
  credentials: LoginCredentials
) => Promise<{ token: string; admin: boolean; exp: number }> = async (
  credentials: LoginCredentials
) => {
  try {
    const session: Session = await endpoints.auth.login(credentials);

    const decodedJwt: Jwt = parseJwt(session.access_token);

    return {
      token: session.access_token,
      admin: decodedJwt.access_level === "administrator",
      exp: decodedJwt.exp,
    };
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

  if (!session) {
    return false;
  }

  try {
    await endpoints.auth.logout();
    await signOut();
    return true;
  } catch (error) {
    return false;
  }
};