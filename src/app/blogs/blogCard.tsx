"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { CSSProperties } from "react";

import { Button, useDisclosure } from "@nextui-org/react";

import { RouterOutputs } from "@/trpc/shared";

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

  const editedDate = dayjs(blog.lastEditTime);

  const firstImage = getFirstImageUrl(JSON.parse(blog.body));

  return (
    <>
      <Link href={`/blogs/${blog.slug}`}>
        <div
          className="relative aspect-[16/9] min-w-[20rem] cursor-pointer overflow-hidden rounded-2xl shadow-xl transition-all active:scale-95 sm:w-96"
          style={getBlogCardStyle(blog)}
        >
          <Image
            draggable={false}
            alt="blog post hero image"
            className={`z-0 h-full w-full ${
              firstImage.found ? "object-cover" : "object-contain"
            }`}
            src={firstImage.url}
            fill={true}
          />
          <div className="absolute bottom-0 flex w-full flex-col items-start justify-between gap-1 rounded-b-none bg-[#fffc] px-5 py-4">
            <div className="flex w-full flex-col items-start">
              <p className="text-lg font-bold">{blog.title}</p>
              <div className="flex w-full justify-between">
                <small className="text-default-500">
                  Authored by {blog.author}
                </small>
                <small className="text-default-500">
                  {editedDate.fromNow()}
                </small>
              </div>
            </div>
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
    <div className="absolute right-0 top-0 flex w-full flex-row items-center justify-end bg-[#fffc] align-baseline">
      <BlogActionButton
        color="secondary"
        onClick={() => router.push(`/blogs/editor?blogId=${blog.id}`)}
      >
        Edit Blog
      </BlogActionButton>
      <BlogActionButton color="warning" onClick={visibilityModal.onOpen}>
        {blog.public ? "Unpublish" : "Publish"}
      </BlogActionButton>
      <BlogActionButton color="danger" onClick={deleteModal.onOpen}>
        Delete
      </BlogActionButton>
      <BlogActionButton color="primary" onClick={tagsModal.onOpen}>
        Edit Tags
      </BlogActionButton>
    </div>
  );
}

function BlogActionButton({
  color = "primary",
  children,
  onClick,
}: {
  color?: "primary" | "danger" | "warning" | "secondary";
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      color={color}
      variant="light"
      radius="full"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </Button>
  );
}

/**
 * given a blog, returns the CSS properties to apply to the blog card
 */
function getBlogCardStyle(blog: Blog): CSSProperties {
  return blog.public
    ? {}
    : {
        opacity: 0.5,
      };
}
