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
  deleteModal: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
  visibilityModal: {
    isOpen: boolean;
    onOpenChange: () => void;
  };
}) {
  const session = useSession();
  const router = useRouter();

  const utils = api.useUtils();

  const { mutate: deleteBlog } = api.blogs.delete.useMutation({
    onMutate: () => {},
    onSuccess: () => {
      toast.success("Blog deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete blog");
    },
  });

  const { mutate: togglePublishBlog } = api.blogs.togglePublish.useMutation({
    onMutate: () => {},
    onSuccess: () => {
      const actionPubUnpub = props.blog.public ? "unpublish" : "publish";
      toast.success(`Blog ${actionPubUnpub}ed successfully!`);
      void utils.blogs.invalidate();
    },
    onError: () => {
      const actionPubUnpub = props.blog.public ? "unpublish" : "publish";
      toast.error(`Failed to ${actionPubUnpub} blog`);
    },
  });

  // if invalid permissions, do not show
  if (session.status !== "authenticated" || !isModerator(session.data)) {
    return <></>;
  }

  // TODO: move this into separate components
  return (
    <>
      <Modal
        isOpen={props.deleteModal.isOpen}
        onOpenChange={props.deleteModal.onOpenChange}
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
                  onPress={() => {
                    deleteBlog({ id: props.blog.id });
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

      <Modal
        isOpen={props.visibilityModal.isOpen}
        onOpenChange={props.visibilityModal.onOpenChange}
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
                  onPress={() => {
                    togglePublishBlog({ id: props.blog.id });
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
    </>
  );
}
