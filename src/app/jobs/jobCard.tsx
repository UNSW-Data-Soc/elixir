"use client";

import Image from "next/image";
import Link from "next/link";

import { useSession } from "next-auth/react";

import { RouterOutputs } from "@/trpc/shared";

import {
  COMPANY_PHOTO_X_PXL,
  COMPANY_PHOTO_Y_PXL,
  isModerator,
} from "../utils";
import { getCompanyImageRoute } from "../utils/s3";
import JobCardActions from "./jobCardActions";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Job = RouterOutputs["jobs"]["getAll"][number];

export default function JobCard({
  job: { company, jobPosting: job },
  moderatorView = true,
}: {
  job: Job;
  moderatorView?: boolean;
}) {
  const session = useSession();

  // job link, fallback onto company website
  const link = job.link ?? company.websiteUrl ?? "#";

  // whether to show job body on hover
  const showJobBody: boolean = job.body.length > 0;

  // expiry date for job as a string
  const expiryDate = dayjs(job.expiration).toString();

  return (
    <div className="relative">
      <Link
        href={link}
        className={`group flex aspect-video flex-col gap-1 rounded-xl border bg-white p-5 transition-all hover:shadow-md ${
          job.public || !moderatorView ? "opacity-100" : "opacity-30"
        }`}
      >
        {company.logo && (
          <Image
            src={getCompanyImageRoute(company.id, company.logo)}
            height={COMPANY_PHOTO_Y_PXL}
            width={COMPANY_PHOTO_X_PXL}
            alt={`${company.name} logo`}
            className={`mx-auto block w-[280px] transition-all ${
              showJobBody ? "group-hover:opacity-10" : ""
            } sm:max-w-xs`}
          />
        )}
        {showJobBody && (
          <div className="absolute bottom-5 left-5 right-5 top-5 mx-auto overflow-y-auto px-2 opacity-0 transition-all group-hover:opacity-100">
            <p className="text-center">{job.body}</p>
          </div>
        )}
        <div
          className={`transition-all ${
            showJobBody ? "group-hover:opacity-0" : ""
          }`}
        >
          <h3 className="text-xl font-semibold">{job.title}</h3>
          <div className="flex flex-row justify-between gap-1">
            <p>{company.name}</p>
            <p className="text-default-500">
              Posted {dayjs(job.createdTime).fromNow()}
            </p>
          </div>
          {job.description.length > 0 && (
            <p
              className={`text-sm transition-all ${
                showJobBody ? "group-hover:opacity-0" : ""
              }`}
            >
              {job.description}
            </p>
          )}
          {moderatorView && isModerator(session.data) && (
            <p className="text-default-500">Expires {expiryDate}</p>
          )}
        </div>
      </Link>
      {moderatorView && isModerator(session.data) && (
        <JobCardActions job={job} />
      )}
    </div>
  );
}
