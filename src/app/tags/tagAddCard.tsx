"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { useState } from "react";

import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

import { PlusIcon } from "@heroicons/react/24/outline";

import { endpoints } from "../api/backend/endpoints";
import { Tag } from "../api/backend/tags";
import { isModerator } from "../utils";

import toast from "react-hot-toast";

export const MAX_TAG_NAME_LENGTH = 50;

export default function TagAddCard(props: {
  handleTagCreation: (tag: Tag) => void;
}) {
  const session = useSession();
  const [showModal, setShowModal] = useState(false);

  if (!isModerator(session.data)) return <></>;

  return (
    <>
      <Card
        isPressable
        className="flex items-center justify-center border-[1px] border-black p-5 sm:w-4/12"
        onPress={() => setShowModal(true)}
      >
        <PlusIcon className="h-8 w-8" />
      </Card>
      <AddTagModal
        isOpen={showModal}
        onOpenChange={() => setShowModal(false)}
        handleTagCreation={props.handleTagCreation}
      />
    </>
  );
}

function AddTagModal(props: {
  isOpen: boolean;
  onOpenChange: () => void;
  handleTagCreation: (tag: Tag) => void;
}) {
  const [name, setName] = useState("");
  const [colour, setColour] = useState("#00FF40");

  async function handleTagCreation() {
    if (name === "" || colour === "") {
      return toast.error("Invalid name or colour");
    }

    if (name.length > MAX_TAG_NAME_LENGTH) {
      return toast.error("Please choose a shorter name!");
    }

    await endpoints.tags
      .create({ name, colour })
      .then((tag) => {
        toast.success("Tag created successfully.");
        props.handleTagCreation(tag);
      })
      .catch(() => {
        toast.error("Failed to create tag");
      });
  }

  return (
    <>
      <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">New Tag</ModalHeader>
              <ModalBody>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-xl border-2 px-4 py-3 transition-all"
                  placeholder="Tag name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="colour">Colour:</label>
                <input
                  type="color"
                  id="Colour"
                  className="h-16 w-full rounded-xl border-2 px-4 py-3 transition-all"
                  value={colour}
                  onChange={(e) => setColour(e.target.value.toUpperCase())}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="warning" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="success"
                  variant="light"
                  onPress={() => {
                    handleTagCreation();
                    onClose();
                  }}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
