"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function BlogsPost() {
  const session = useSession();
  if (session.status === "unauthenticated" || !session.data?.user.admin) redirect("/blogs");

  return (
    <main className="p-24 text-black">
      <h1 className="text-3xl font-bold">Create a new blog post.</h1>
    </main>
  );
}
