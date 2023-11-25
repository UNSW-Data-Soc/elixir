"use client";

import { Company } from "../api/backend/companies";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Sponsorship } from "../api/backend/sponsorships";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Tooltip } from "@nextui-org/tooltip";
dayjs.extend(relativeTime);

export default function SponsorshipExpirationInfo(props: {
  sponsorship: Sponsorship;
}) {
  const expirationTime = dayjs(Date.parse(props.sponsorship.expiration));
  const expirationPassed = expirationTime.isAfter(Date.now());

  const session = useSession();
  const router = useRouter();

  if (session.status !== "authenticated" || !session.data.user.moderator) {
    return <></>;
  }

  return (
    <>
      <Tooltip content={expirationTime.format("DD/MM/YYYY HH:mm")}>
        <p>
          {expirationPassed
            ? `Expires ${expirationTime.fromNow()}`
            : `Expired ${expirationTime.toNow(true)} ago`}
        </p>
      </Tooltip>
    </>
  );
}
