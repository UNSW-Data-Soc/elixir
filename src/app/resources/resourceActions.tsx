"use client";

import { useState } from "react";
import { endpoints } from "../api/backend/endpoints";
import { Resource } from "../api/backend/resources";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import ModifyBearerTags from "../modifyBearerTags";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import {
  Attachment,
  AttachmentInfo,
  Detachment,
  TagReferences,
} from "../api/backend/tags";

export default function ResourceActions(props: {
  resource: Resource;
  updateResource: (updatedResources: Resource, remove: boolean) => void;
  updateAttachments?: (
    updatedAttachments: AttachmentInfo[],
    to_attach: Attachment[],
    to_detach: Detachment[],
  ) => void;
}) {
  const [showVisibilityDialogue, setShowVisibilityDialogue] = useState(false);
  const [showDeletionDialogue, setShowDeletionDialogue] = useState(false);
  const [showModifyTagsDialogue, setShowModifyTagsDialogue] = useState(false);

  const session = useSession();
  const router = useRouter();

  if (session.status !== "authenticated" || !session.data.user.moderator) {
    return <></>;
  }

  async function handleResourceDeletion() {
    await endpoints.resources
      .remove(props.resource.id)
      .then(() => {
        toast.success("Resource deleted successfully!");
      })
      .catch(() => {
        toast.error("Failed to delete resource");
      })
      .finally(() => {
        setShowDeletionDialogue(false);
        props.updateResource(props.resource, true);
        return;
      });
  }

  async function handleResourcePublication() {
    let actionPubUnpub = props.resource.public ? "unpublished" : "published";
    let actionPubUnpubPresent = props.resource.public ? "unpublish" : "publish";

    await endpoints.resources
      .updateVisibility(props.resource.id, !props.resource.public)
      .then(() => {
        toast.success(`Resource ${actionPubUnpub} successfully!`);
        let updatedResource = props.resource;
        updatedResource.public = !props.resource.public;
        props.updateResource(updatedResource, false);
      })
      .catch(() => {
        toast.error(`Failed to ${actionPubUnpubPresent} resource`);
      })
      .finally(() => {
        setShowVisibilityDialogue(false);
        return;
      });
  }

  return (
    <>
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
                  This action will delete &apos;{props.resource.title}&apos;
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleResourceDeletion}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
                  {props.resource.public
                    ? "You can always publish again!"
                    : "You can always unpublish later"}
                </small>
              </ModalHeader>
              <ModalBody>
                <p>
                  {props.resource.public
                    ? `This action will remove the '${props.resource.title}' resource from public view`
                    : `This will make the resource '${props.resource.title}' publicly available`}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleResourcePublication}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
                  Add or remove tags from this resource
                </small>
              </ModalHeader>
              <ModalBody>
                <ModifyBearerTags
                  bearer="resource"
                  bearer_id={props.resource.id}
                  initialOptionsFilter={(ai) =>
                    ai.bearer_id === props.resource.id
                  }
                  updateAttachments={props.updateAttachments}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="success" variant="light" onPress={onClose}>
                  Done
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="m-3 flex items-center justify-between gap-5 align-baseline">
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
        {props.resource.public ? (
          <Button
            color="secondary"
            radius="full"
            variant="light"
            onClick={() => {
              setShowVisibilityDialogue(true);
            }}
          >
            Unpublish
          </Button>
        ) : (
          <Button
            color="secondary"
            radius="full"
            variant="light"
            onClick={() => {
              setShowVisibilityDialogue(true);
            }}
          >
            Publish
          </Button>
        )}
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
