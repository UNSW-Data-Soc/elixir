import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import UsersList from "./userList";
import { endpoints } from "../api/backend/endpoints";

export default async function Users() {
    const session = await getServerSession();
    if (!session) {
        return redirect("/");
    }

    let tags = await endpoints.tags.getAll();

    return (
        <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
            <UsersList
                tags={tags}
            />
        </div>
    );
}
