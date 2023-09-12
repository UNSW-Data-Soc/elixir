"use client";

import { PlusIcon } from "@heroicons/react/24/outline";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function BlogsAddCard() {
  const session = useSession();
  const router = useRouter();

  if (session.status === "authenticated" && session.data.user.admin) {
    return (
      <button
        className="border-[1px] border-black p-5 flex justify-center items-center sm:w-4/12 hover:scale-105 hover:shadow-xl transition-all"
        onClick={() => router.push("/blogs/create")}
      >
        <PlusIcon className="h-8 w-8" />
      </button>
    );
  }

  return <></>;
}
