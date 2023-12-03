"use client";

import { endpoints } from "@/app/api/backend/endpoints";
import { TagReferences } from "@/app/api/backend/tags";
import { Button } from "@nextui-org/button";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { MAX_TAG_NAME_LENGTH } from "../tagAddCard";
import { Divider } from "@nextui-org/divider";

export default function TagActions(props: {
  tagReference: TagReferences;
  numRefences: number;
  handleTagDeletion: (id: string) => void;
  handleTagUpdate: (updatedTagReference: TagReferences) => void;
}) {
  const session = useSession();

  if (session.status !== "authenticated" || !session.data.user.moderator) {
    return <></>;
  }

  async function handleDeletion() {
    await endpoints.tags
      .deleteTag(props.tagReference.tags_id)
      .then(() => {
        props.handleTagDeletion(props.tagReference.tags_id);
        toast.success("Tag deleted successfully.");
      })
      .catch(() => {
        toast.error("Failed to delete tag.");
      });
  }

  return (
    <>
      <TagModification
        tagReference={props.tagReference}
        handleTagUpdate={props.handleTagUpdate}
      />
      <Divider />

      <small className="flex w-full flex-col items-center justify-center align-baseline text-default-500">
        Deleting this tag will remove all {props.numRefences} references to this
        tag.
      </small>
      <Button color="danger" variant="light" onPress={handleDeletion}>
        Delete Tag
      </Button>
    </>
  );
}

function TagModification(props: {
  tagReference: TagReferences;
  handleTagUpdate: (updatedTagReference: TagReferences) => void;
}) {
  const [name, setName] = useState(props.tagReference.tags_name);
  const [colour, setColour] = useState(props.tagReference.tags_colour);

  async function handleTagUpdate() {
    if (name === "" || colour === "") {
      return toast.error("Invalid name or colour");
    }

    if (name.length > MAX_TAG_NAME_LENGTH) {
      return toast.error("Please choose a shorter name!");
    }

    await endpoints.tags
      .update({ id: props.tagReference.tags_id, name, colour })
      .then((tag) => {
        props.handleTagUpdate({
          ...props.tagReference,
          tags_name: name,
          tags_colour: colour,
        });
        toast.success("Tag updated successfully.");
      })
      .catch(() => {
        toast.error("Failed to update tag");
      });
  }

  return (
    <>
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
      <Button color="success" variant="light" onPress={handleTagUpdate}>
        Update
      </Button>
    </>
  );
}
