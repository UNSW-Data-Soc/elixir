"use client";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import JobCard from "./jobCard";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Job = RouterOutputs["jobs"]["getAll"][number];

export default function jobsList({ jobs: initJobs }: { jobs: Job[] }) {
  const { data: jobs } = api.jobs.getAll.useQuery(undefined, {
    initialData: initJobs,
  });

  return (
    <>
      {jobs.length === 0 ? (
        <p className="text-center text-lg">
          No jobs listed for now. Check back later!
        </p>
      ) : (
        <div className="flex flex-row">
          {jobs.map((j) => (
            <JobCard key={j.jobPosting.id} job={j} />
          ))}
        </div>
      )}
    </>
  );
}
