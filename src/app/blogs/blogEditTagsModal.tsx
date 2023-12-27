"use client";

import { useEffect, useState } from "react";

import { Button, Modal, ModalContent, useDisclosure } from "@nextui-org/react";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

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
  const ctx = api.useUtils();

  const {
    data: tags,
    isLoading,
    isError,
  } = api.tags.blogs.get.useQuery({ id: blog.id });

  const { mutate: detachBlogTag } = api.tags.blogs.detach.useMutation({
    onSuccess: () => {
      toast.success("Tag removed!");
      void ctx.tags.blogs.invalidate();
    },
    onError: () => {
      toast.error("Failed to remove tag");
    },
  });

  if (isLoading) return <></>;
  if (isError) return <div>ERROR: Failed to load tags.</div>;

  return (
    <Modal isOpen={tagsModal.isOpen} onOpenChange={tagsModal.onOpenChange}>
      <ModalContent>
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
              <div className="flex flex-col gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    style={{ backgroundColor: tag.colour }}
                    className="flex flex-row justify-between text-white"
                  >
                    <p className="p-2 px-3">{tag.name}</p>
                    <button
                      className="bg-[#D9435F] p-2"
                      onClick={() =>
                        detachBlogTag({ tagId: tag.id, blogId: blog.id })
                      }
                    >
                      <TrashIcon height={20} color="white" />
                    </button>
                  </div>
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
  const [matching, setMatching] = useState(false);

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
    console.log(tag);
    if (tag === "" || !allTags) {
      setMatching(false);
      return;
    }
    const existingMatch = allTags.find((t) => t.name === tag);
    if (existingMatch) {
      setColour(existingMatch.colour);
      setMatching(true);
    } else {
      setMatching(false);
    }
  }, [tag, allTags]);

  if (isLoading) return <></>;
  if (isError) return <div>ERROR: Failed to load tags.</div>;

  const addTag = () => {
    if (tag.trim().length === 0)
      return toast.error("Tag name cannot be empty.");
    if (tags.find((t) => t.name === tag))
      return toast.error("Tag already attached to blog.");

    const existingTag = allTags.find((t) => t.name === tag);
    if (existingTag) {
      attachTag({ blogId: blog.id, tagId: existingTag.id });
    } else {
      createTag({ name: tag, colour });
    }
  };

  return (
    <form
      className="flex flex-row items-center border"
      onSubmit={(e) => {
        e.preventDefault();
        addTag();
      }}
    >
      <input
        type="text"
        placeholder="Tag name"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="flex-grow bg-transparent px-2 py-1 outline-none"
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
        onChange={(e) => setColour(e.target.value.toUpperCase())}
        className="h-12 flex-grow cursor-pointer appearance-none overflow-hidden rounded-xl border-0 bg-transparent transition-all"
        disabled={matching || attachLoading || createLoading}
      />
      <button
        type="submit"
        color="primary"
        disabled={attachLoading || createLoading}
        className="aspect-square h-full p-2"
      >
        <PlusIcon height={20} />
      </button>
    </form>
  );
}
