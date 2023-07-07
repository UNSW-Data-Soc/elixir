import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { PlusIcon } from "@heroicons/react/outline";

export default function TagsAddCard() {
  const session = useSession();
  const router = useRouter();

  if (session.status === "authenticated" && session.data.user.admin) {
    return (
      <button
        className="border-[1px] border-black p-5 flex justify-center items-center sm:w-4/12"
        onClick={() => router.push("/tag")}
      >
        <PlusIcon className="h-8 w-8" />
      </button>
    );
  }

  return null;
}