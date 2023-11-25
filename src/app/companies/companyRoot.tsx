"use client";

import { useEffect } from "react";
import CompanyAddCard from "./companyAddCard";
import CompanyList from "./companyList";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CompanyRoot() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status !== "authenticated" || !session.data.user.moderator) {
      return router.push("/");
    }
  }, []);

  return (
    <div className="container m-auto flex flex-wrap justify-center gap-5 p-10">
      <CompanyAddCard />
      <CompanyList />
    </div>
  );
}
