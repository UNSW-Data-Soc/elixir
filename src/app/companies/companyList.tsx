"use client";

import { useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
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
import CompanyActions from "./companyActions";

import { toast } from "react-hot-toast";

export default function CompanyList() {
  const {
    data: companies,
    isLoading,
    isError,
  } = api.companies.getAll.useQuery();

  if (isError) {
    toast.error("Failed to load companies");
  }

  return (
    <>
      {isLoading && <Spinner />}
      {!!companies && companies.length === 0 && (
        <p className="text-lg py-10">
          No companies yet! Click on the [+] button to add some.
        </p>
      )}
      {!!companies &&
        !isLoading &&
        companies.map((company) => (
          <CompaniesCard key={company.id} company={company} />
        ))}
    </>
  );
}

function CompaniesCard(props: {
  company: RouterOutputs["companies"]["getAll"][number];
}) {
  const [showcompanyDescription, setShowcompanyDescription] = useState(false);

  return (
    <>
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-lg">{props.company.name}</p>
            {!!props.company.websiteUrl && (
              <Link
                isExternal
                showAnchorIcon
                href={props.company.websiteUrl}
                style={{ cursor: "pointer" }}
              >
                {props.company.websiteUrl}
              </Link>
            )}
          </div>
        </CardHeader>
        <Divider />
        {!!props.company.logo && (
          <>
            <CardBody onClick={() => setShowcompanyDescription(true)}>
              <Image
                src={getCompanyImageRoute(props.company.id, props.company.logo)}
                alt={`${props.company.name} logo`}
                className="object-cover rounded-xl"
                height={COMPANY_PHOTO_Y_PXL}
                width={COMPANY_PHOTO_X_PXL}
              />
            </CardBody>
            <Divider />
          </>
        )}

        <CardFooter className="flex items-center justify-center align-baseline">
          <CompanyActions company={props.company} />
        </CardFooter>
      </Card>
      {showcompanyDescription && (
        <CompanyDescriptionModal
          company={props.company}
          onOpenChange={() => setShowcompanyDescription(false)}
        />
      )}
    </>
  );
}

function CompanyDescriptionModal(props: {
  company: RouterOutputs["companies"]["getAll"][number];
  onOpenChange: () => void;
}) {
  return (
    <Modal isOpen={true} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {props.company.name}
              {!!props.company.websiteUrl && (
                <small className="text-default-500">
                  <Link
                    isExternal
                    showAnchorIcon
                    href={props.company.websiteUrl}
                    className="cursor-pointer"
                  >
                    {props.company.websiteUrl}
                  </Link>
                </small>
              )}
            </ModalHeader>
            <ModalBody>
              <p>{props.company.description}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
