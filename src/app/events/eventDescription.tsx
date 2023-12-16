"use client";

import { RouterOutputs } from "@/trpc/shared";
import { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Tooltip } from "@nextui-org/tooltip";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";

import { TIPTAP_EXTENSIONS } from "../blogs/tiptapExtensions";
import { generateHTML } from "@tiptap/html";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export function EventDescription({
  children,
  event,
}: {
  children: {
    trigger: React.ReactNode;
    header: React.ReactNode;
    body: React.ReactNode;
  };
  event: RouterOutputs["events"]["getAll"][number];
}) {
  const [showEventDescription, setShowEventDescription] = useState(false);

  return (
    <>
      <div onClick={() => setShowEventDescription(true)}>
        {children.trigger}
      </div>
      {showEventDescription && (
        <EventDescriptionModal
          event={event}
          onOpenChange={() => setShowEventDescription(false)}
          header={children.header}
          body={children.body}
        />
      )}
    </>
  );
}

function EventDescriptionModal(props: {
  event: RouterOutputs["events"]["getAll"][number];
  onOpenChange: () => void;
  header: React.ReactNode;
  body: React.ReactNode;
}) {
  return (
    <Modal isOpen={true} onOpenChange={props.onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 pb-0">
              {props.header}
            </ModalHeader>
            <ModalBody>{props.body}</ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
