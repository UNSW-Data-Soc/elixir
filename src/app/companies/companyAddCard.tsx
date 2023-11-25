"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { Card } from "@nextui-org/react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CompanyAddCard() {
  const session = useSession();
  const router = useRouter();

  if (session.status === "authenticated" && session.data.user.moderator) {
    return (
      <>
        <Card
          isPressable
          className="flex items-center justify-center border-[1px] border-black p-5 sm:w-4/12"
          onPress={() => router.push("/companies/create")}
        >
          <PlusIcon className="h-8 w-8" />
        </Card>
      </>
    );
  }

  return <></>;
}
