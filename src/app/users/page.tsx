import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import UsersList from "./userList";

export default async function Users() {
    const session = await getServerSession();
    if (!session) return redirect("/");

    return (
        <main className="p-10 flex justify-center items-center text-black h-screen overflow-hidden fixed w-screen">
        <UsersList/>
        </main>
    );
}
