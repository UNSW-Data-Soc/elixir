import { getServerSession } from "next-auth/next";
import { EventsAddForm } from "./eventsAddForm";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";

export default async function EventsPost() {

    const session = await getServerSession();
    if (!session) return redirect("/");


    return (
        <main className="p-10 flex justify-center items-center text-black h-screen overflow-hidden fixed w-screen">
            {/* <h1 className="text-3xl font-bold">Create a new blog post.</h1> */}
            <EventsAddForm />
        </main>
    );
}
