"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEventHandler } from "react";

export default async function BlogsPost() {
  // const session = useSession();
  // const router = useRouter();
  // if (session.status === "unauthenticated" || !session.data?.user.admin) router.push("/blogs");

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    console.log("FORM SUBMITTED");
  };

  return (
    <main className="p-24 text-black">
      <h1 className="text-3xl font-bold">Create a new blog post.</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="submit"
          value="All done!"
          className="px-5 py-3 rounded-xl shadow-lg bg-sky-500 cursor-pointer hover:bg-sky-600 transition-colors"
        />
      </form>
    </main>
  );
}
