"use client";

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

export default function SponsorshipsActions({
  sponsorship: { sponsorship, company },
}: {
  sponsorship: RouterOutputs["sponsorships"]["getAll"][number];
}) {
  const [showDeletionDialogue, setShowDeletionDialogue] = useState(false);

  const session = useSession();

  const ctx = api.useUtils();

  const { mutate: deleteSponsorship } = api.sponsorships.delete.useMutation({
    onSuccess: () => {
      toast.success("Sponsorship deleted successfully!");
      void ctx.sponsorships.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to delete sponsorship: ${error.message}`);
    },
    onSettled: () => {
      setShowDeletionDialogue(false);
    },
  });

  const { mutate: togglePublishSpon } =
    api.sponsorships.togglePublish.useMutation({
      onSuccess: ({ sponPublic }) => {
        toast.success(
          `Sponsorship ${
            sponPublic ? "published" : "unpublished"
          } successfully!`,
        );
        void ctx.sponsorships.invalidate();
      },
      onError: (error) => {
        toast.error(`Failed to publish sponsorship: ${error.message}`);
      },
    });

  if (session.status === "loading") return <></>;
  if (!isModerator(session.data)) {
    return <></>;
  }

  function handleSponsorshipDeletion() {
    deleteSponsorship({ id: sponsorship.id });
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
          Delete Sponsorship
        </Button>
        <Button
          color="success"
          radius="full"
          variant="light"
          onClick={() => {
            togglePublishSpon({ id: sponsorship.id });
          }}
        >
          {sponsorship.public ? "Unpublish" : "Publish"}
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
                  This action will permanently delete the sponsorship by &apos;
                  {company.name}&apos;!
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleSponsorshipDeletion}
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
