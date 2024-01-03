"use client";

import Image from "next/image";
import Link from "next/link";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import { COMPANY_PHOTO_X_PXL, COMPANY_PHOTO_Y_PXL } from "../utils";
import { getCompanyImageRoute } from "../utils/s3";

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

function JobCard({ job: { company, jobPosting: job } }: { job: Job }) {
  // job link, fallback onto company website
  const link = job.link ?? company.websiteUrl ?? "#";

  return (
    <Link
      href={link}
      className="group relative flex flex-col gap-1 rounded-xl border p-5 transition-all hover:shadow-md"
    >
      {company.logo && (
        <Image
          src={getCompanyImageRoute(company.id, company.logo)}
          height={COMPANY_PHOTO_Y_PXL}
          width={COMPANY_PHOTO_X_PXL}
          alt={`${company.name} logo`}
          className="mx-auto block max-w-xs transition-all group-hover:opacity-10"
        />
      )}
      <div className="absolute bottom-5 left-5 right-5 top-5 mx-auto flex items-center justify-center opacity-0 transition-all group-hover:opacity-100">
        <p className="text-center">{job.body}</p>
      </div>
      <div className="transition-all group-hover:opacity-0">
        <h3 className="text-xl font-semibold">{job.title}</h3>
        <div className="flex flex-row justify-between gap-1">
          <p>{company.name}</p>
          <p className="text-default-500">
            Posted {dayjs(job.createdTime).fromNow()}
          </p>
        </div>
        {job.description.length > 0 && (
          <p className="text-sm transition-all group-hover:opacity-0">
            {job.description}
          </p>
        )}
      </div>
    </Link>
  );
}
