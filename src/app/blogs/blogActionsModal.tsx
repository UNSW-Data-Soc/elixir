"use client";

import { Button } from "@nextui-org/button";
import { Company } from "../api/backend/companies";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { endpoints } from "../api/backend/endpoints";
import toast from "react-hot-toast";
import { Blog } from "../api/backend/blogs";

export default function BlogActionsModal(props: {
  blog: Blog;
  handleDeletion: (id: string) => void;
  handleBlogUpdate: (updatedBlog: Blog) => void;
}) {
  const [showDeletionDialogue, setShowDeletionDialogue] = useState(false);
  const [showVisibilityDialogue, setShowVisibilityDialogue] = useState(false);

  const session = useSession();
  const router = useRouter();

  if (session.status !== "authenticated" || !session.data.user.moderator) {
    return <></>;
  }

  async function handleBlogDeletion() {
    await endpoints.blogs
      .deleteBlog({ id: props.blog.id })
      .then(() => {
        toast.success("Blog deleted successfully!");
        props.handleDeletion(props.blog.id);
      })
      .catch(() => {
        toast.error("Failed to delete blog");
      })
      .finally(() => {
        setShowDeletionDialogue(false);
        return;
      });
  }

  async function handleBlogPublication() {
    let actionPubUnpub = props.blog.public ? "unpublished" : "published";
    let actionPubUnpubPresent = props.blog.public ? "unpublish" : "publish";

    await endpoints.blogs
      .update({
        title: props.blog.title,
        body: props.blog.body,
        author: props.blog.author,
        id: props.blog.id,
        blogPublic: !props.blog.public,
      })
      .then(() => {
        toast.success(`Blog ${actionPubUnpub} successfully!`);
        let updatedBlog = props.blog;
        updatedBlog.public = !props.blog.public;
        props.handleBlogUpdate(updatedBlog);
      })
      .catch(() => {
        toast.error(`Failed to ${actionPubUnpubPresent} blog`);
      })
      .finally(() => {
        setShowVisibilityDialogue(false);
      });
  }

  return (
    <>
      <div className="flex items-center justify-center align-baseline">
        <Button
          color="secondary"
          radius="full"
          variant="light"
          onClick={() => {
            router.push(`/blogs/editor?blogSlug=${props.blog.slug}`);
          }}
        >
          Edit Blog
        </Button>
        {props.blog.public ? (
          <Button
            color="warning"
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
            color="warning"
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
          color="danger"
          radius="full"
          variant="light"
          onClick={() => {
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
                  onPress={handleBlogDeletion}
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
                  onPress={handleBlogPublication}
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
