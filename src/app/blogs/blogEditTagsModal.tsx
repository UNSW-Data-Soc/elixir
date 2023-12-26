"use client";

import { useEffect, useState } from "react";

import { Button, Modal, ModalContent, useDisclosure } from "@nextui-org/react";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import { PlusIcon } from "@heroicons/react/24/outline";

import toast from "react-hot-toast";

type Blog = RouterOutputs["blogs"]["getAll"][number];
type Tag = RouterOutputs["tags"]["blogs"]["get"][number];

export default function BlogEditTagsModal({
  blog,
  tagsModal,
}: {
  blog: Blog;
  tagsModal: { isOpen: boolean; onOpenChange: () => void };
}) {
  const {
    data: tags,
    isLoading,
    isError,
  } = api.tags.blogs.get.useQuery({ id: blog.id });

  if (isLoading) return <></>;
  if (isError) return <div>ERROR: Failed to load tags.</div>;

  return (
    <Modal
      isOpen={tagsModal.isOpen}
      onOpenChange={tagsModal.onOpenChange}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <ModalContent
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {(onClose) => (
          <div className="flex flex-col gap-3 p-5">
            <div>
              <h6 className="text-xl font-semibold">
                Edit tags for{" "}
                <span className="font-normal">&quot;{blog.title}&quot;</span>
              </h6>
              <p className="text-default-500">
                Tags help users find your blog.
              </p>
            </div>
            {tags.length === 0 && (
              <p className="italic">No tags on this blog.</p>
            )}
            {tags.length > 0 && (
              <div>
                {tags.map((tag) => (
                  <p key={tag.id} style={{ backgroundColor: tag.colour }}>
                    {tag.name}
                  </p>
                ))}
              </div>
            )}
            <AddTagForm tags={tags} blog={blog} />
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}

function AddTagForm({ tags, blog }: { tags: Tag[]; blog: Blog }) {
  const ctx = api.useUtils();

  const [tag, setTag] = useState("");
  const [colour, setColour] = useState("#000000");

  const { data: allTags, isLoading, isError } = api.tags.getAll.useQuery();

  const { isLoading: attachLoading, mutate: attachTag } =
    api.tags.blogs.attach.useMutation({
      onSuccess: () => {
        setTag("");
        setColour("#000000");
        void ctx.tags.invalidate();

        toast.success("Tag added!");
      },
    });

  const { isLoading: createLoading, mutate: createTag } =
    api.tags.create.useMutation({
      onSuccess: ({ id }) => {
        // ! attaches tag after creation
        attachTag({ blogId: blog.id, tagId: id });
      },
    });

  useEffect(() => {
    if (tag === "" || !allTags) return;
    const existingMatch = allTags.find((t) => t.name === tag);
    if (existingMatch) {
      setColour(existingMatch.colour);
    }
  }, [tag, allTags]);

  if (isLoading) return <></>;
  if (isError) return <div>ERROR: Failed to load tags.</div>;

  const addTag = () => {
    if (tag.trim().length === 0) return;
    if (tags.find((t) => t.name === tag)) return;

    const existingTag = allTags.find((t) => t.name === tag);
    if (existingTag) {
      attachTag({ blogId: blog.id, tagId: existingTag.id });
    } else {
      createTag({ name: tag, colour });
    }
  };

  return (
    <div className="flex flex-row gap-2">
      <input
        type="text"
        placeholder="Tag name"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="flex-grow"
        disabled={attachLoading || createLoading}
        list={"tagsList"}
      />
      <datalist id={"tagsList"}>
        {allTags
          .filter((t) => !tags.find((tag) => t.id === tag.id))
          .map((t) => (
            <option key={t.id} value={t.name} />
          ))}
      </datalist>
      <input
        type="color"
        value={colour}
        onChange={(e) => setColour(e.target.value)}
        disabled={attachLoading || createLoading}
      />
      <Button
        color="primary"
        radius="full"
        variant="light"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addTag();
        }}
        disabled={attachLoading || createLoading}
      >
        <PlusIcon height={20} />
      </Button>
    </div>
  );
}
