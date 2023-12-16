"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { Card } from "@nextui-org/react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { isModerator } from "../utils";

export default function EventAddCard() {
  const session = useSession();
  const router = useRouter();

  if (!isModerator(session.data)) {
    return <></>;
  }

  return (
    <>
      <Card
        isPressable
        className="flex aspect-[16/9] min-w-[20rem] items-center justify-center p-5 sm:w-96"
        onPress={() => router.push("/events/create")}
      >
        <PlusIcon className="h-8 w-8" />
      </Card>
    </>
  );
}
