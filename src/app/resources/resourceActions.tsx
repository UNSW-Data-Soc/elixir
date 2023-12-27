"use client";

import { useSession } from "next-auth/react";

import { useEffect, useState } from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

import { isModerator } from "../utils";

import toast from "react-hot-toast";

type Resource = RouterOutputs["resources"]["getAll"][number];
type Tag = RouterOutputs["tags"]["resources"]["get"][number];

export default function ResourceActions({
  resource,
  tags,
}: {
  resource: Resource;
  tags: Tag[];
}) {
  const session = useSession();

  const { data: tagss } = api.tags.resources.get.useQuery(
    { id: resource.id },
    {
      initialData: tags,
    },
  );

  if (!isModerator(session.data)) {
    return <></>;
  }

  return (
    <div className="flex flex-row gap-2">
      <DeleteResource resource={resource} />
      <VisibilityResource resource={resource} />
      <ModifyResourceTags resource={resource} tags={tagss} />
    </div>
  );
}

/**
 * button + modal to delete resource
 */
function DeleteResource({ resource }: { resource: Resource }) {
  const ctx = api.useUtils();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { mutate: deleteResource } = api.resources.delete.useMutation({
    onSuccess: () => {
      toast.success("Resource deleted successfully!");
      void ctx.resources.invalidate();
    },
    onError: (err) => {
      toast.error(`Failed to delete resource: ${err.message}`);
    },
  });

  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpen();
        }}
        color="danger"
        radius="full"
        variant="light"
      >
        Delete
      </Button>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        caption={<p>This action is permanent and irreversible!</p>}
        body={
          <p>
            This action will delete the resource &quot;{resource.title}
            &quot;
          </p>
        }
        onConfirm={() => {
          deleteResource({ id: resource.id });
        }}
      />
    </>
  );
}

/**
 * button + modal to toggle resource visibility
 */
function VisibilityResource({ resource }: { resource: Resource }) {
  const ctx = api.useUtils();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { mutate: togglePublish } = api.resources.togglePublish.useMutation({
    onSuccess: (res) => {
      toast.success(
        `Resource ${res.public ? "published" : "unpublished"} successfully!`,
      );
      void ctx.resources.invalidate();
    },
    onError: (err) => {
      toast.error(
        `Failed to ${resource.public ? "unpublish" : "publish"}: ${
          err.message
        }`,
      );
    },
  });

  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpen();
        }}
        color="warning"
        radius="full"
        variant="light"
      >
        {resource.public ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        caption={<p>You can always publish again!</p>}
        body={
          <p>
            This action will {resource.public ? "unpublish" : "publish"} the
            resource &quot;{resource.title}&quot;
          </p>
        }
        onConfirm={() => {
          togglePublish({ id: resource.id });
        }}
      />
    </>
  );
}

/**
 * button + modal to modify resource tags
 */
function ModifyResourceTags({
  resource,
  tags,
}: {
  resource: Resource;
  tags: Tag[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpen();
        }}
        color="secondary"
        radius="full"
        variant="light"
      >
        Edit Tags
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col">
                <h3 className="text-xl font-semibold">Edit tags</h3>
                <p className="font-light">
                  Add or remove tags from &quot;{resource.title}&quot;
                </p>
              </ModalHeader>
              <ModalBody>
                <TagsList resource={resource} tags={tags} />
                <AttachTagForm resource={resource} tags={tags} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function TagsList({ resource, tags }: { resource: Resource; tags: Tag[] }) {
  const ctx = api.useUtils();

  const { mutate: detachResourceTag } = api.tags.resources.detach.useMutation({
    onSuccess: () => {
      toast.success("Tag removed successfully!");
      void ctx.tags.invalidate();
    },
    onError: (err) => {
      toast.error(`Failed to remove tag: ${err.message}`);
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {tags.map((tag) => (
        <div key={tag.id} className="flex flex-row justify-start gap-2">
          <p
            style={{ backgroundColor: tag.colour }}
            className="rounded-xl px-2 py-1 text-white"
          >
            {tag.name}
          </p>
          <button
            onClick={() =>
              detachResourceTag({
                resourceId: resource.id,
                tagId: tag.id,
              })
            }
          >
            <TrashIcon height={20} />
          </button>
        </div>
      ))}
    </div>
  );
}

function AttachTagForm({
  resource,
  tags,
}: {
  resource: Resource;
  tags: Tag[];
}) {
  const ctx = api.useUtils();
  const [name, setName] = useState("");
  const [colour, setColour] = useState("#000000");

  const { data: allTags, isLoading, isError } = api.tags.getAll.useQuery();

  const { mutate: createTag } = api.tags.create.useMutation({
    onSuccess: ({ id: tagId }) => {
      // ! after creating a tag, attach it to the resource
      attachResourceTag({
        resourceId: resource.id,
        tagId,
      });
    },
  });

  const { mutate: attachResourceTag } = api.tags.resources.attach.useMutation({
    onSuccess: () => {
      toast.success("Tagged successfully!");
      void ctx.tags.invalidate();
    },
    onError: (err) => {
      toast.error(`Failed to tag: ${err.message}`);
    },
  });

  useEffect(() => {
    if (name === "" || !allTags) return;
    const existingMatch = allTags.find((tag) => tag.name === name);
    if (existingMatch) {
      setColour(existingMatch.colour);
    }
  }, [name, allTags]);

  if (isLoading) return <></>;
  if (isError) return <p>Error fetching tags...</p>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (name === "") {
          return toast.error("Please enter a tag name!");
        }

        const existingTagged = tags.find((tag) => tag.name === name);
        if (existingTagged) {
          return toast.error("Resource is already tagged with this tag!");
        }

        const existingMatch = allTags.find((tag) => tag.name === name);
        if (existingMatch) {
          attachResourceTag({
            resourceId: resource.id,
            tagId: existingMatch.id,
          });
        }

        if (colour === "") {
          return toast.error("Please enter a tag colour!");
        }

        createTag({
          name,
          colour,
        });
      }}
      className="flex flex-row gap-2"
    >
      <input
        type="text"
        id="name"
        className="w-full rounded-xl border-2 px-4 py-2 transition-all"
        placeholder="Tag name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        list={"tagNames"}
      />
      <datalist id={"tagNames"}>
        {allTags.map((tag) => (
          <option value={tag.name} key={tag.id} />
        ))}
      </datalist>
      <input
        type="color"
        id="Colour"
        className="h-12 w-full cursor-pointer appearance-none overflow-hidden rounded-xl border-0 bg-transparent transition-all"
        value={colour}
        onChange={(e) => setColour(e.target.value.toUpperCase())}
      />
      <button type="submit" className="">
        <PlusIcon height={20} color="#000" />
      </button>
    </form>
  );
}

const ConfirmationModal = ({
  isOpen,
  onOpenChange,
  body,
  caption,
  onConfirm,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  caption: React.ReactNode;
  body: React.ReactNode;
  onConfirm: () => void;
}) => (
  <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            Are you sure?
            <small className="text-default-500">{caption}</small>
          </ModalHeader>
          <ModalBody>{body}</ModalBody>
          <ModalFooter>
            <Button color="primary" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              variant="light"
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);
