"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import AddCard from "../components/AddCard";
import { isModerator } from "../utils";

export default function JobAddCard() {
  const session = useSession();
  const router = useRouter();

  if (!isModerator(session.data)) return <></>;

  return <AddCard onPress={() => router.push("/jobs/create")} />;
}
