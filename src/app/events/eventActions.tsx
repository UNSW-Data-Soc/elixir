"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import toast from "react-hot-toast";

import { RouterOutputs } from "@/trpc/shared";
import { api } from "@/trpc/react";

import { isModerator } from "../utils";

export default function EventActionsModal(props: {
  event: RouterOutputs["events"]["getAll"][number];
}) {
  const session = useSession();

  const [showDeletionDialogue, setShowDeletionDialogue] = useState(false);
  const [showVisibilityDialogue, setShowVisibilityDialogue] = useState(false);

  const utils = api.useUtils();

  const { mutate: deleteEvent } = api.events.delete.useMutation({
    onMutate: () => {},
    onSuccess: () => {
      toast.success("Event deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete event");
    },
    onSettled: () => {
      setShowDeletionDialogue(false);
    },
  });

  const { mutate: togglePublishEvent } = api.events.togglePublish.useMutation({
    onMutate: () => {},
    onSuccess: () => {
      const actionPubUnpub = props.event.public ? "unpublish" : "publish";
      toast.success(`Event ${actionPubUnpub}ed successfully!`);
      void utils.events.invalidate();
      window.location.reload(); // TODO: how to update page without full reload
    },
    onError: () => {
      const actionPubUnpub = props.event.public ? "unpublish" : "publish";
      toast.error(`Failed to ${actionPubUnpub} event`);
    },
    onSettled: () => {
      setShowVisibilityDialogue(false);
    },
  });

  if (session.status !== "authenticated" || !isModerator(session.data)) {
    return <></>;
  }

  return (
    <>
      <div className="items-center justify-center align-baseline">
        <Button
          color="secondary"
          radius="full"
          variant="light"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowVisibilityDialogue(true);
          }}
        >
          {props.event.public ? "Unpublish" : "Publish"}
        </Button>

        <Button
          color="danger"
          radius="full"
          variant="light"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDeletionDialogue(true);
          }}
        >
          Delete
        </Button>
      </div>

      <Modal
        isOpen={showVisibilityDialogue}
        onOpenChange={() => setShowVisibilityDialogue(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure?
                <small className="text-default-500">
                  {props.event.public
                    ? "You can always publish again!"
                    : "You can always unpublish later"}
                </small>
              </ModalHeader>
              <ModalBody>
                <p>
                  {props.event.public
                    ? `This action will remove the '${props.event.title}' event from public view`
                    : `This will make the event '${props.event.title}' publicly available`}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => togglePublishEvent({ id: props.event.id })}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
                  This action will permanentely delete the event &apos;
                  {props.event.title}&apos;!
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => deleteEvent({ id: props.event.id })}
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
