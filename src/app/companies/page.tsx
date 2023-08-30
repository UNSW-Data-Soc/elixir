"use client";

import CompanyAddCard from "./companyAddCard";
import CompanyList from "./companyList";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Resources() {
  const session = useSession();
  const router = useRouter();
  
  if (session.status !== "authenticated" || !session.data.user.admin) {
    return router.push("/");
  }

  return (
      <main className="bg-white ">
          <header className="text-white p-12 bg-[#4799d1] flex flex-col gap-4">
              <h1 className="text-3xl font-semibold">Companies</h1>
              <p>
                  To create sponsorships or job offerings, first a company needs to be created.
              </p>
          </header>
          <CompaniesContainer />
      </main>
  );
}

function CompaniesContainer() {
    return (
        <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
            <CompanyAddCard/>
            <CompanyList/>
        </div>
    );
}
