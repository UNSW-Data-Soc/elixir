import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import ProfileManager from "./profileManager";
import { endpoints } from "@/app/api/backend/endpoints";
import { User } from "@/app/api/backend/users";

export default async function Users({ params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session) {
        return redirect("/");
    }

    return (
        <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
            <ProfileManager user_id={params.id} />
        </div>
    );
}
