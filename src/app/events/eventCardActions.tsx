"use client";

import { Button } from "@nextui-org/button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { isModerator } from "../utils";
import { RouterOutputs } from "@/trpc/shared";

export default function EventCardActions(props: {
  event: RouterOutputs["events"]["getAll"][number];
}) {
  const [showModifyTagsDialogue, setShowModifyTagsDialogue] = useState(false);

  const session = useSession();

  if (session.status !== "authenticated" || !isModerator(session.data)) {
    return <></>;
  }

  return (
    <>
      <Modal
        isOpen={showModifyTagsDialogue}
        onOpenChange={() => setShowModifyTagsDialogue(false)}
        className="h-96"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit tags
                <small className="text-default-500">
                  Add or remove tags from this event
                </small>
              </ModalHeader>
              {/* <ModalBody>
                <ModifyBearerTags
                  bearer="event"
                  bearer_id={props.event.id}
                  initialOptionsFilter={(ai) => ai.bearer_id === props.event.id}
                  updateAttachments={props.updateAttachments}
                />
              </ModalBody> */}
              <ModalFooter>
                <Button color="success" variant="light" onPress={onClose}>
                  Done
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="flex items-center justify-between align-baseline">
        <Button
          color="warning"
          radius="full"
          variant="light"
          onClick={() => {
            setShowModifyTagsDialogue(true);
          }}
        >
          Edit Tags
        </Button>
      </div>
    </>
  );
}
