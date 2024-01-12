import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/server/auth";

import { isModerator } from "@/app/utils";

import CompanyAddCard from "./companyAddCard";
import CompanyList from "./companyList";

export default async function CompanyRoot() {
  const session = await getServerAuthSession();

  if (!isModerator(session)) {
    redirect("/auth/login");
  }

  return (
    <>
      <div className="absolute bottom-5 right-5">
        <CompanyAddCard />
      </div>
      <div className="container m-auto flex flex-wrap justify-center gap-5 p-10 relative">
        <CompanyList />
      </div>
    </>
  );
}
