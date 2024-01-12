"use client";

import { useState } from "react";

import { useDisclosure } from "@nextui-org/react";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import { Spinner } from "../utils";
import TagsEditModal from "./tagsEditModal";

type Tag = RouterOutputs["tags"]["getAll"][number];

export default function TagsList() {
  const { data: tags, isLoading, isError } = api.tags.getAll.useQuery();

  const [tag, setTag] = useState<Tag | null>(null);

  // edit tag modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  if (isLoading) return <Spinner />;
  if (isError) return <div>Failed to get tags</div>;

  return (
    <div className="flex flex-row flex-wrap justify-center gap-5">
      {tags.map((t) => (
        <div
          key={t.id}
          className="cursor-pointer rounded-md border border-b-8 p-3 px-5 text-lg transition-all hover:bg-[#fafafa]"
          style={{ borderBottomColor: t.colour }}
          onClick={() => {
            setTag(t);
            onOpen();
          }}
        >
          <h3>{t.name}</h3>
        </div>
      ))}
      <TagsEditModal isOpen={isOpen} onOpenChange={onOpenChange} tag={tag} />
    </div>
  );
}
