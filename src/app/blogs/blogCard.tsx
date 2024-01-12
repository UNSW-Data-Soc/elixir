"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { CSSProperties } from "react";

import { useDisclosure } from "@nextui-org/react";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import {
  EyeIcon,
  EyeSlashIcon,
  PencilSquareIcon,
  TagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { isModerator } from "../utils";
import BlogActionsModal from "./blogActionsModal";
import BlogEditTagsModal from "./blogEditTagsModal";
import { getFirstImageUrl } from "./utils";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Blog = RouterOutputs["blogs"]["getAll"][number];

export default function BlogCard({ blog }: { blog: Blog }) {
  const session = useSession();

  // modal open states
  const tagsModal = useDisclosure();
  const deleteModal = useDisclosure();
  const visibilityModal = useDisclosure();

  // tags
  const { data: tags } = api.tags.blogs.get.useQuery({ id: blog.id });

  const createdDate = dayjs(blog.createdTime);

  const firstImage = getFirstImageUrl(JSON.parse(blog.body));

  return (
    <>
      <Link href={`/blogs/${blog.slug}`}>
        <div className="relative aspect-[5/4] min-w-[20rem] cursor-pointer rounded-md shadow-xl transition-all active:scale-[.98] sm:aspect-[16/9] sm:w-96 sm:min-w-[30rem]">
          <Image
            draggable={false}
            alt="blog post hero image"
            className={`z-0 h-full w-full ${
              firstImage.found ? "object-cover" : "object-contain"
            }`}
            src={firstImage.url}
            fill={true}
            style={getBlogCardStyle(blog)}
          />
          <div className="absolute bottom-0 top-0 flex w-full flex-col items-start justify-end gap-2 rounded-b-none bg-gradient-to-t from-black px-5 py-4">
            <div
              className="flex w-full flex-col items-start gap-1 text-white"
              style={getBlogCardStyle(blog)}
            >
              <p className="text-lg font-bold">{blog.title}</p>
              <div className="flex w-full items-center justify-start gap-2 text-default-200">
                <small className="text-sm">Authored by {blog.author}</small>
                <div className="h-1 w-1 rounded-full bg-white">
                  {/* HTML cdot code: &#183; */}
                </div>
                <small className="text-sm">{createdDate.fromNow()}</small>
              </div>
            </div>
            {!!tags && tags.length > 0 && (
              <div
                className="flex flex-row flex-wrap gap-2 text-xs"
                style={getBlogCardStyle(blog)}
              >
                {tags.map((tag) => (
                  <p
                    key={tag.id}
                    style={{ backgroundColor: tag.colour }}
                    className="rounded-xl border border-white p-1 px-2 text-white"
                  >
                    {tag.name}
                  </p>
                ))}
              </div>
            )}
          </div>
          {isModerator(session.data) && (
            <BlogActionButtons
              blog={blog}
              deleteModal={deleteModal}
              visibilityModal={visibilityModal}
              tagsModal={tagsModal}
            />
          )}
        </div>
      </Link>
      <BlogEditTagsModal blog={blog} tagsModal={tagsModal} />
      <BlogActionsModal
        blog={blog}
        deleteModal={deleteModal}
        visibilityModal={visibilityModal}
      />
    </>
  );
}

function BlogActionButtons({
  visibilityModal,
  deleteModal,
  tagsModal,
  blog,
}: {
  visibilityModal: { onOpen: () => void };
  deleteModal: { onOpen: () => void };
  tagsModal: { onOpen: () => void };
  blog: Blog;
}) {
  const router = useRouter();
  return (
    <div className="absolute right-0 top-0 m-2 flex flex-row items-center overflow-hidden rounded-xl">
      <BlogActionButton
        className="bg-[#14A1D9]"
        onClick={() => router.push(`/blogs/editor?blogId=${blog.id}`)}
      >
        <PencilSquareIcon height={20} />{" "}
        <span className="hidden sm:block">Edit</span>
      </BlogActionButton>
      <BlogActionButton
        className="bg-[#F29F05]"
        onClick={visibilityModal.onOpen}
      >
        {blog.public ? <EyeSlashIcon height={20} /> : <EyeIcon height={20} />}
        <span className="hidden sm:block">
          {blog.public ? "Unpublish" : "Publish"}
        </span>
      </BlogActionButton>
      <BlogActionButton className="bg-[#D9435F]" onClick={deleteModal.onOpen}>
        <TrashIcon height={20} />
        <span className="hidden sm:block">Delete</span>
      </BlogActionButton>

      <BlogActionButton className="bg-[#9F68A6]" onClick={tagsModal.onOpen}>
        <TagIcon height={20} />
        <span className="hidden sm:block">Edit Tags</span>
      </BlogActionButton>
    </div>
  );
}

function BlogActionButton({
  className = "bg-white",
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex flex-row items-center gap-2 rounded-none p-2 px-3 text-sm text-white ${className} transition-all hover:brightness-110`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

/**
 * given a blog, returns the CSS properties to apply to the blog card
 */
function getBlogCardStyle(blog: Blog): CSSProperties {
  return blog.public
    ? {}
    : {
        // opacity: 0.5,
        filter: "brightness(0.5)",
      };
}
