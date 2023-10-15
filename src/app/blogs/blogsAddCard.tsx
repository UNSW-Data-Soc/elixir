"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { Card } from "@nextui-org/react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function BlogsAddCard() {
  const session = useSession();
  const router = useRouter();

  if (session.status === "authenticated" && session.data.user.admin) {
    return (
      <>
        <Card
          isPressable
          className="border-[1px] border-black p-5 flex justify-center items-center max-w-sm min-w-[24rem]"
          onPress={() => router.push("/blogs/create")}
        >
          <PlusIcon className="h-8 w-8" />
        </Card>
      </>
    );
  }

  return <></>;
}
