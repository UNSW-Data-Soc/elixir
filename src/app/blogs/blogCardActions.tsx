"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

import { Blog } from "../api/backend/blogs";
import { endpoints } from "../api/backend/endpoints";
import { toast } from "react-hot-toast";

const BlogCardActions = (blog: Blog) => {
  const session = useSession();
  const router = useRouter();

  if (!session || session.status === "unauthenticated") return <></>;

  return (
    <div className="flex flex-row gap-8">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/blogs/editor/${blog.slug}`);
        }}
        className="text-blue-500 hover:underline"
      >
        Edit
      </button>
      {!blog.public && (
        <button
          className="text-green-500"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await endpoints.blogs.update({ ...blog, blogPublic: true });
            toast.success(`Blog "${blog.title}" published!`);
          }}
        >
          Publish
        </button>
      )}
      {!!blog.public && (
        <button
          className="text-orange-500"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await endpoints.blogs.update({ ...blog, blogPublic: false });
            toast.success(`Blog "${blog.title}" unpublished!`);
          }}
        >
          Unpublish
        </button>
      )}
      <button
        className="text-red-500"
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          // TODO: add confirmation box
          await endpoints.blogs.deleteBlog({ id: blog.id });
          toast.success(`Blog "${blog.title}" deleted!`);
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default BlogCardActions;
