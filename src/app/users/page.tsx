import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/server/auth";

import UserAddCard from "./addUserCard";
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
    <div className="relative m-auto flex w-full flex-grow flex-wrap justify-center gap-5 p-10">
      <UsersList />
      <div className="absolute bottom-5 right-5">
        <UserAddCard />
      </div>
    </div>
  );
}
