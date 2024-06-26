"use client";

import { CSSProperties, useState } from "react";

import {
  Button,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import { COMPANY_PHOTO_X_PXL, COMPANY_PHOTO_Y_PXL, Spinner } from "../utils";
import { getCompanyImageRoute } from "../utils/s3";
import SponsorshipsActions from "./sponsorshipActions";
import SponsorshipExpirationInfo from "./sponsorshipExpirationInfo";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-hot-toast";

dayjs.extend(relativeTime);

export default function SponsorshipsList() {
  const {
    data: sponsorships,
    isError,
    isLoading,
  } = api.sponsorships.getAll.useQuery({});

  if (isError) {
    toast.error("Failed to load sponsorships");
    return <></>;
  }

  const major = sponsorships?.filter((s) => s.sponsorship.type === "major");
  const partners = sponsorships?.filter(
    (s) => s.sponsorship.type === "partner",
  );
  const others = sponsorships?.filter((s) => s.sponsorship.type === "other");

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-16 align-baseline">
        {isLoading && <Spinner />}
        {!!sponsorships && sponsorships.length > 0 ? (
          <>
            {!!major && major.length > 0 && (
              <SponsorshipTypeSection
                sponsorships={major}
                heading={"Major Sponsors"}
              />
            )}
            {!!partners && partners.length > 0 && (
              <SponsorshipTypeSection
                sponsorships={partners}
                heading={"Partners"}
              />
            )}
            {!!others && others.length > 0 && (
              <SponsorshipTypeSection sponsorships={others} heading={"Other"} />
            )}
          </>
        ) : (
          sponsorships?.length === 0 && (
            <div className="text-lg">
              We&apos;re still looking for sponsors! Please reach out to us if
              you are interested.
            </div>
          )
        )}
      </div>
    </>
  );
}

function SponsorshipTypeSection({
  sponsorships,
  heading,
}: {
  sponsorships: RouterOutputs["sponsorships"]["getAll"];
  heading: string;
}) {
  return (
    <div>
      {!!sponsorships && sponsorships.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-3 align-baseline">
          <h1 className="text-3xl font-light">{heading}</h1>
          <div className="flex flex-wrap items-center justify-center gap-4 align-baseline md:gap-12">
            {sponsorships.map((sponsorship) => (
              <div
                key={sponsorship.sponsorship.id}
                style={getSponsorshipCardStyle(sponsorship)}
              >
                <SponsorshipCard
                  key={sponsorship.sponsorship.id}
                  sponsorship={sponsorship}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getSponsorshipCardStyle(
  s: RouterOutputs["sponsorships"]["getAll"][number],
): CSSProperties {
  const notExpired = dayjs(s.sponsorship.expiration).isAfter(Date.now());

  return notExpired && s.sponsorship.public
    ? {}
    : {
        opacity: 0.5,
      };
}

function SponsorshipCard({
  sponsorship: { sponsorship, company },
}: {
  sponsorship: RouterOutputs["sponsorships"]["getAll"][number];
}) {
  const [showcompanyDescription, setShowcompanyDescription] = useState(false);

  if (!company.logo) return <></>;

  return (
    <>
      <div className="max-w-[300px]">
        <Image
          src={getCompanyImageRoute(company.id, company.logo)}
          alt="Profile picture"
          className="rounded-xl object-cover"
          style={{ cursor: "pointer" }}
          height={COMPANY_PHOTO_Y_PXL * 0.4}
          width={COMPANY_PHOTO_X_PXL * 0.4}
          onClick={() => {
            setShowcompanyDescription(true);
          }}
        />
        {showcompanyDescription && (
          <SponsorshipDescriptionModal
            sponsorship={{ company, sponsorship }}
            onOpenChange={() => setShowcompanyDescription(false)}
          />
        )}
      </div>
    </>
  );
}

function SponsorshipDescriptionModal({
  sponsorship: { company, sponsorship },
  onOpenChange,
}: {
  sponsorship: RouterOutputs["sponsorships"]["getAll"][number];
  onOpenChange: () => void;
}) {
  return (
    <Modal isOpen={true} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {company.name}
              <small className="text-default-500">
                {/* Only displays if user is admin */}
                <SponsorshipExpirationInfo
                  sponsorship={{ company, sponsorship }}
                />
                {!!company.websiteUrl && (
                  <Link
                    isExternal
                    showAnchorIcon
                    href={company.websiteUrl}
                    style={{ cursor: "pointer" }}
                  >
                    {company.websiteUrl}
                  </Link>
                )}
              </small>
            </ModalHeader>
            <ModalBody className="flex flex-col items-center justify-center text-center align-baseline">
              {!!company.logo && (
                <Image
                  src={getCompanyImageRoute(company.id, company.logo)}
                  alt="Profile picture"
                  className="rounded-xl object-cover"
                  height={300}
                  width={300}
                />
              )}
              <p>{sponsorship.message}</p>
            </ModalBody>
            <ModalFooter className="flex items-center justify-between align-baseline">
              <SponsorshipsActions sponsorship={{ sponsorship, company }} />
              {/* <Button color="primary" variant="light" onPress={onClose}>
                Close
              </Button> */}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
