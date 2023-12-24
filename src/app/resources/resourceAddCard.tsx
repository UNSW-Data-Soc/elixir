"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isModerator } from "../utils";
import AddCard from "../components/AddCard";

export default function ResourceAddCard() {
  const session = useSession();
  const router = useRouter();

  if (!isModerator(session.data)) {
    return <></>;
  }

  return <AddCard onPress={() => router.push("/resources/create")} />;
}
