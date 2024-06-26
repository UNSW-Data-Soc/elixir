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

import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";

import { isModerator } from "../utils";

import toast from "react-hot-toast";

type Event = RouterOutputs["events"]["getAll"]["upcoming"][number];

export default function EventActionsModal(props: { event: Event }) {
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
      <div className="flex items-center justify-center align-baseline">
        <EventActionButton
          className="bg-primary-500"
          onClick={() => {
            setShowVisibilityDialogue(true);
          }}
        >
          <EyeIcon className="h-5 w-5" />
          {props.event.public ? "Unpublish" : "Publish"}
        </EventActionButton>
        <EventActionButton
          className="bg-danger-500"
          onClick={() => {
            setShowDeletionDialogue(true);
          }}
        >
          <TrashIcon className="h-5 w-5" />
          Delete
        </EventActionButton>
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

function EventActionButton({
  className = "bg-white",
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex flex-row items-center gap-2 rounded-none p-2 px-3 text-sm text-white ${className} transition-all hover:brightness-110`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
}
