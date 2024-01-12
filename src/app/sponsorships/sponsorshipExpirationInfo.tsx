"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { Tooltip } from "@nextui-org/tooltip";

import { RouterOutputs } from "@/trpc/shared";

import { Company } from "../api/backend/companies";
import { Sponsorship } from "../api/backend/sponsorships";
import { isModerator } from "../utils";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function SponsorshipExpirationInfo({
  sponsorship: { sponsorship },
}: {
  sponsorship: RouterOutputs["sponsorships"]["getAll"][number];
}) {
  const expirationTime = dayjs(sponsorship.expiration);
  const expirationPassed = expirationTime.isAfter(Date.now());

  const session = useSession();
  const router = useRouter();

  if (!isModerator(session.data)) {
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
