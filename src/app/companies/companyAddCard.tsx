"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { useEffect } from "react";

import AddCard from "../components/AddCard";
import { isModerator } from "../utils";

export default function CompanyAddCard() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/companies/create");
  }, [router]);

  if (!isModerator(session.data)) {
    return <></>;
  }

  return <AddCard onPress={() => router.push("/companies/create")} />;
}
