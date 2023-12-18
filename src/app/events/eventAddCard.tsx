"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { Card } from "@nextui-org/react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { isModerator } from "../utils";
import { useEffect } from "react";

export default function EventAddCard() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/events/create");
  }, []);

  if (!isModerator(session.data)) {
    return <></>;
  }

  return (
    <>
      <Card
        isPressable
        className="flex aspect-[16/9] min-w-[20rem] max-w-[400px] items-center justify-center p-5 sm:w-96"
        onPress={() => router.push("/events/create")}
      >
        <PlusIcon className="h-8 w-8" />
      </Card>
    </>
  );
}
