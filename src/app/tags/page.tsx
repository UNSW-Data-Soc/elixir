import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/server/auth";

import { isModerator } from "@/app/utils";

import TagsList from "./tagsList";

export default async function Tags() {
  const session = await getServerAuthSession();

  if (!isModerator(session)) {
    redirect("/auth/login?from=/tags");
  }

  return (
    <div className="flex w-full flex-grow flex-col flex-wrap justify-start gap-5">
      <header className="flex flex-col gap-4 bg-[#4799d1] p-12 text-white">
        <h1 className="text-3xl font-semibold">Tags</h1>
        <p>
          Manage the tags that are used to categorise blogs, events and
          resources.
        </p>
      </header>
      <div className="container mx-auto flex flex-col gap-8 p-4 sm:p-10">
        {/* <p className="text-center text-xl text-default-500">
          Psst... generally, choosing darker colours for tags is better :)
        </p> */}
        <TagsList />
      </div>
    </div>
  );
}
