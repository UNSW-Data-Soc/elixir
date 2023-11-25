"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Tooltip } from "@nextui-org/tooltip";
import { Job } from "../api/backend/jobs";
import { useEffect, useState } from "react";
import { endpoints } from "../api/backend/endpoints";
import { UserPublic } from "../api/backend/users";
dayjs.extend(relativeTime);

export default function JobInformation(props: { job: Job }) {
  const createdTime = dayjs(Date.parse(props.job.created_time));
  const expirationTime = dayjs(Date.parse(props.job.expiration_time));

  const expirationPassed = expirationTime.isAfter(Date.now());

  const session = useSession();
  const router = useRouter();

  const [author, setAuthor] = useState<UserPublic>();

  useEffect(() => {
    async function getDetails() {
      let user = await endpoints.users.get(props.job.creator);
      setAuthor(user);
    }

    getDetails();
  }, [props.job.creator]);

  if (session.status !== "authenticated" || !session.data.user.moderator) {
    return <></>;
  }

  return (
    <>
      <div className="flex flex-col items-start align-baseline">
        <Tooltip content={createdTime.format("DD/MM/YYYY HH:mm")}>
          <p>
            Created {createdTime.fromNow()} {author && <>by {author?.name}</>}
          </p>
        </Tooltip>
        <Tooltip content={expirationTime.format("DD/MM/YYYY HH:mm")}>
          <p>
            {expirationPassed
              ? `Expires ${expirationTime.fromNow()}`
              : `Expired ${expirationTime.toNow(true)} ago`}
          </p>
        </Tooltip>
      </div>
    </>
  );
}
