"use client";

import { PlusIcon } from "@heroicons/react/24/outline";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function BlogsAddButton() {
  const session = useSession();
  const router = useRouter();

  if (session.status === "authenticated" && session.data.user.admin) {
    return (
      <button
        className="transition-all bg-[#4799d1] fixed bottom-7 right-7 z-50 rounded-full p-3 shadow-xl hover:bg-[#267ab1]"
        onClick={() => router.push("/blogs/post")}
      >
        <PlusIcon className="h-12 w-12 text-white" />
      </button>
    );
  }

  return <></>;
}
