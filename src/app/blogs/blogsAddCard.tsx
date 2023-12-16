"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { isModerator } from "../utils";

import { PlusIcon } from "@heroicons/react/24/outline";
import { Card } from "@nextui-org/card";

export default function BlogsAddCard() {
  const session = useSession();
  const router = useRouter();

  if (session.status === "unauthenticated" || !isModerator(session.data)) {
    return <></>;
  }

  return (
    <Card
      className="flex aspect-[16/9] min-w-[20rem] items-center justify-center p-5 sm:w-96"
      isPressable
      onPress={() => router.push("/blogs/create")}
    >
      <PlusIcon className="h-8 w-8" />
    </Card>
  );
}
