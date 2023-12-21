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

export default function BlogActionsModal(props: {
  blog: RouterOutputs["blogs"]["getAll"][number];
}) {
  const session = useSession();
  const router = useRouter();

  const [showDeletionDialogue, setShowDeletionDialogue] = useState(false);
  const [showVisibilityDialogue, setShowVisibilityDialogue] = useState(false);

  const utils = api.useUtils();

  const { mutate: deleteBlog } = api.blogs.delete.useMutation({
    onMutate: () => {},
    onSuccess: () => {
      toast.success("Blog deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete blog");
    },
    onSettled: () => {
      setShowDeletionDialogue(false);
    },
  });

  const { mutate: togglePublishBlog } = api.blogs.togglePublish.useMutation({
    onMutate: () => {},
    onSuccess: () => {
      const actionPubUnpub = props.blog.public ? "unpublish" : "publish";
      toast.success(`Blog ${actionPubUnpub}ed successfully!`);
      void utils.blogs.invalidate();
      window.location.reload(); // TODO: is there a way to force updates to the blog list? or not since it's server-side rendered
    },
    onError: () => {
      const actionPubUnpub = props.blog.public ? "unpublish" : "publish";
      toast.error(`Failed to ${actionPubUnpub} blog`);
    },
    onSettled: () => {
      setShowVisibilityDialogue(false);
    },
  });

  // if invalid permissions, do not show
  if (session.status !== "authenticated" || !isModerator(session.data)) {
    return <></>;
  }

  // TODO: move this into separate components
  return (
    <>
      <div className="flex items-center justify-center align-baseline">
        <Button
          color="secondary"
          radius="full"
          variant="light"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/blogs/editor?blogId=${props.blog.id}`);
          }}
        >
          Edit Blog
        </Button>
        <Button
          color="warning"
          radius="full"
          variant="light"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowVisibilityDialogue(true);
          }}
        >
          {props.blog.public ? "Unpublish" : "Publish"}
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
                <p>This action will permanently delete the blog</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => deleteBlog({ id: props.blog.id })}
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
                  {props.blog.public
                    ? "You can always publish again!"
                    : "You can always unpublish later"}
                </small>
              </ModalHeader>
              <ModalBody>
                <p>
                  {props.blog.public
                    ? `This action will remove the '${props.blog.title}' blog from public view`
                    : `This will make the blog '${props.blog.title}' publicly available`}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => togglePublishBlog({ id: props.blog.id })}
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
