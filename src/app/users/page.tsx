import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/server/auth";

import UsersList from "./userList";

export default async function Users() {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/auth/login");
  }

  if (session?.user.role !== "admin") {
    return (
      <div className="container m-auto flex flex-grow flex-wrap justify-center gap-5 p-10">
        You do not have permission to view this page.
      </div>
    );
  }
  return (
    <div className="container m-auto flex flex-wrap justify-center gap-5 p-10">
      <UsersList />
    </div>
  );
}
