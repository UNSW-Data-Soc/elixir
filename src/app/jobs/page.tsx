import { api } from "@/trpc/server";

import JobAddCard from "./jobAddCard";
import JobsList from "./jobsList";

export default async function Jobs() {
  const jobs = await api.jobs.getAll.query();

  return (
    <main className="relative flex w-full flex-grow flex-col bg-white">
      <header className="flex flex-col gap-4 bg-[#4799d1] p-12 text-white">
        <h1 className="text-3xl font-semibold">Jobs Board</h1>
        <p>
          Are you interested in gaining real-world experience to apply knowledge
          learnt in your degree and fast forward your career? Keep an eye out
          for internship and graduate opportunities that are constantly updated
          on this page!
        </p>
      </header>
      <div className="container m-auto flex flex-grow flex-col flex-wrap gap-5 p-5 sm:p-10">
        <div className="absolute bottom-5 right-5 z-50">
          <JobAddCard />
        </div>
        <JobsList jobs={jobs} />
      </div>
    </main>
  );
}
