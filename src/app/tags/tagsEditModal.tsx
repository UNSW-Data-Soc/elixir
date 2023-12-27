"use client";

import { useEffect, useState } from "react";

import { Divider, Modal, ModalContent, useDisclosure } from "@nextui-org/react";

import { t } from "@/server/api/trpc";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import { ArrowDownOnSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import { Spinner } from "../utils";

import toast from "react-hot-toast";

type Tag = RouterOutputs["tags"]["getAll"][number];

type TagsEditModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  tag: Tag | null;
};

export default function TagsEditModal({
  isOpen,
  onOpenChange,
  tag,
}: TagsEditModalProps) {
  const [tagName, setTagName] = useState(tag?.name ?? "");
  const [tagColour, setTagColour] = useState(tag?.colour ?? "");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // mutations
  const ctx = api.useUtils();
  const { mutate: deleteTag, isLoading: isDeleting } =
    api.tags.delete.useMutation({
      onSuccess: () => {
        toast.success("Tag deleted successfully!");
        void ctx.tags.invalidate();
      },
      onError: () => {
        toast.error("Failed to delete tag");
      },
    });
  const { mutate: updateTag, isLoading: isUpdating } =
    api.tags.update.useMutation({
      onSuccess: () => {
        toast.success("Tag updated successfully!");
        void ctx.tags.invalidate();
      },
      onError: () => {
        toast.error("Failed to update tag");
      },
    });

  // update tagName and tagColour when tag prop changes
  useEffect(() => {
    setTagName(tag?.name ?? "");
    setTagColour(tag?.colour ?? "");
  }, [tag?.colour, tag?.name]);

  if (!tag) return <></>;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="p-5">
        {(onClose) => (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold">Edit tag</h2>
              <p className="text-default-500">id: {tag.id}</p>
              <div className="flex flex-row items-center gap-3">
                <label>Tag Name</label>
                <input
                  type="text"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  className="flex-grow rounded-lg bg-[#eee] p-2 px-3 text-black outline-none transition-all focus:bg-[#ddd]"
                  disabled={isUpdating || isDeleting}
                />
              </div>
              <div className="flex flex-row items-center gap-3">
                <label>Tag Colour</label>
                <input
                  type="color"
                  value={tagColour}
                  onChange={(e) => setTagColour(e.target.value)}
                  className="h-12 flex-grow appearance-none rounded-lg border-none bg-transparent text-black outline-none transition-all focus:bg-[#ddd]"
                  disabled={isUpdating || isDeleting}
                />
              </div>
              <div className="relative">
                <div className="flex flex-row justify-between">
                  <button
                    className="flex flex-row gap-1 rounded-xl bg-[#D9435F] p-2 px-3 text-white transition-all hover:brightness-110"
                    disabled={isUpdating || isDeleting}
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <TrashIcon height={20} />
                    <span>Delete Tag</span>
                  </button>
                  <div
                    className={`${
                      showDeleteConfirm ? "flex" : "hidden"
                    } absolute left-0 top-0 flex-col gap-4 border bg-white p-3`}
                  >
                    <p className="text-center">
                      Are you sure? Deleting a tag removes it from all blogs,
                      resources and events. This action is irreversible.
                    </p>
                    <div className="flex w-full flex-row gap-4">
                      <button
                        className="w-1/2 rounded-md bg-[#D9435F] p-1 px-4 text-white transition-all hover:brightness-105"
                        onClick={() => {
                          deleteTag({ id: tag.id });
                          onClose();
                        }}
                      >
                        Yes
                      </button>
                      <button
                        className="w-1/2 rounded-md bg-[#333] p-1 px-4 text-white transition-all hover:brightness-105"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        No
                      </button>
                    </div>
                  </div>
                  <button
                    className="flex flex-row gap-1 rounded-xl bg-[#14A1D9] p-2 px-3 text-white transition-all hover:brightness-110"
                    disabled={isUpdating || isDeleting}
                    onClick={() => {
                      updateTag({
                        id: tag.id,
                        name: tagName,
                        colour: tagColour,
                      });
                      onClose();
                    }}
                  >
                    <ArrowDownOnSquareIcon height={20} />
                    <span>Save changes</span>
                  </button>
                </div>
              </div>
            </div>
            <Divider />
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">Preview</h2>
              <div className="flex flex-row justify-center">
                <p
                  style={{ backgroundColor: tagColour }}
                  className="inline rounded-xl border border-white p-1 px-2 text-white"
                >
                  {tagName}
                </p>
              </div>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
