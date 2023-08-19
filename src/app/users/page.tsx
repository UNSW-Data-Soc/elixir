import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import UsersList from "./userList";

export default async function Users() {
    const session = await getServerSession();
    if (!session) {
        return redirect("/");
    }

    return (
        <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
            <UsersList/>
        </div>
    );
}
