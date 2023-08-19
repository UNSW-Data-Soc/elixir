import { callFetch } from "./endpoints";

const register = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  return await callFetch({
    route: "/user",
    method: "POST",
    authRequired: false,
    body: JSON.stringify({ email, name, password }),
  });
};

const login = async ({ email, password }: { email: string; password: string }) => {
  const formBodyStrings: string[] = [];
  formBodyStrings.push("username=" + encodeURIComponent(email));
  formBodyStrings.push("password=" + encodeURIComponent(password));
  const formBody = formBodyStrings.join("&");

  return await callFetch({
    route: "/login",
    method: "POST",
    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    body: formBody,
  });
};

const logout = async () => {
  return await callFetch({
    route: "/logout",
    method: "POST",
    authRequired: true,
  });
};

async function resetPasswordRequest(email: string) {
  return await callFetch({
    route: `/reset/password?email=${email}`,
    method: "POST",
    authRequired: false,
  });
}

async function resetPasswordFromToken(token: string, new_password: string) {
  return await callFetch({
    route: `/reset/password/${token}`,
    method: "POST",
    authRequired: false,
    body: JSON.stringify({password: new_password})
  });
}


export const auth = {
  register,
  login,
  logout,
  resetPasswordRequest,
  resetPasswordFromToken
};
