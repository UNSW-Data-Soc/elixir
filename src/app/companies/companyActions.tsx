"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { useState } from "react";

import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import { isModerator } from "../utils";

import toast from "react-hot-toast";

export default function CompanyActions(props: {
  company: RouterOutputs["companies"]["getAll"][number];
}) {
  const [showDeletionDialogue, setShowDeletionDialogue] = useState(false);

  const session = useSession();

  const ctx = api.useUtils();
  const { mutate: deleteCompany } = api.companies.delete.useMutation({
    onSuccess: () => {
      toast.success("Company deleted successfully!");
      void ctx.companies.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to delete company: ${error.message}`);
    },
    onSettled: () => {
      setShowDeletionDialogue(false);
    },
  });

  if (session.status === "loading") return <></>;
  if (!isModerator(session.data)) {
    return <></>;
  }

  function handleCompanyDeletion() {
    deleteCompany({ id: props.company.id });
  }

  return (
    <>
      <div className="items-center justify-center align-baseline">
        <Button
          color="danger"
          radius="full"
          variant="light"
          onClick={() => {
            setShowDeletionDialogue(true);
          }}
        >
          Delete
        </Button>
      </div>
      <Modal
        isOpen={showDeletionDialogue}
        onOpenChange={() => setShowDeletionDialogue(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure?
                <small className="text-default-500">
                  This action is permanent and irreversible!
                </small>
              </ModalHeader>
              <ModalBody>
                <p>
                  This action will permanentely delete the company &apos;
                  {props.company.name}&apos; and all associated sponsorships and
                  job postings!
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleCompanyDeletion}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
