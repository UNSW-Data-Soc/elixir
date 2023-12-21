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
      <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center flex-grow">
        You do not have permission to view this page.
      </div>
    );
  }
  return (
    <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
      <UsersList />
    </div>
  );
}
