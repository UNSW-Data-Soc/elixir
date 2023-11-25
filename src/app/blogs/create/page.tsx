"use client";

import { endpoints } from "@/app/api/backend/endpoints";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEventHandler, useRef } from "react";
import toast from "react-hot-toast";

const DEFAULT_BLOG_CONTENT = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Write your exciting blog post here!" }],
    },
    { type: "paragraph" },
    { type: "horizontalRule" },
    { type: "paragraph" },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo diam, placerat eu dolor sit amet, sollicitudin gravida tortor. Ut neque leo, tristique ac arcu nec, fringilla vehicula leo. In efficitur sapien ex, eu dignissim lorem tincidunt non. ",
        },
      ],
    },
    { type: "paragraph" },
    {
      type: "image",
      attrs: {
        src: "https://static.ffx.io/images/$zoom_1%2C$multiply_1.3061%2C$ratio_1.777778%2C$width_588%2C$x_0%2C$y_22/t_crop_custom/q_86%2Cf_auto/31bc6e9479ea58d2cb31601157a7ddc9fc41ed5a",
        alt: null,
        title: null,
      },
    },
    { type: "paragraph" },
    { type: "horizontalRule" },
    { type: "paragraph" },
    {
      type: "blockquote",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Aenean lacinia dui sit amet lectus suscipit bibendum. In et nunc mollis, tempus sapien at, eleifend quam. In ultrices gravida magna, non gravida dui facilisis in. ",
            },
          ],
        },
      ],
    },
    { type: "paragraph" },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Duis sed nibh ac risus porttitor posuere a in augue. Suspendisse quam erat, luctus vel tellus non, sodales ornare lacus. Morbi ac metus mi. Phasellus eu fringilla leo, in cursus elit. Mauris sed odio aliquam, hendrerit ante vel, pulvinar orci. ",
        },
      ],
    },
  ],
};

export default function BlogCreate() {
  const router = useRouter();
  const session = useSession();

  const blogTitle = useRef<string>("");
  const blogAuthor = useRef<string>("");

  if (session.status === "loading")
    return (
      <div className="flex h-full w-full items-center justify-center p-10">
        Loading...
      </div>
    );
  // redirect use if unauthenticated
  if (session.status === "unauthenticated" || !session.data?.user.moderator) {
    router.push("/auth/login");
  }

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const blog = await endpoints.blogs.create({
      title: blogTitle.current,
      author: blogAuthor.current,
      body: JSON.stringify(DEFAULT_BLOG_CONTENT),
      public: false,
    });

    if (!blog) {
      toast.error("Failed to create blog");
      return;
    }

    router.push(`/blogs/editor?blogSlug=${blog.slug}`);
  };

  return (
    <main className="left-0 top-0 flex h-screen w-screen items-center justify-center">
      <div className="mx-auto flex flex-col gap-3 px-10 py-12 sm:max-w-[80%] sm:px-0 md:max-w-[75%] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[40%]">
        <h1 className="text-3xl font-bold">Start working on a new blog!</h1>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="title"
            onChange={(e) => (blogTitle.current = e.target.value)}
            className="mb-4 w-full border-b border-black py-3 text-xl outline-none"
          />
          <input
            type="text"
            placeholder="author"
            onChange={(e) => (blogAuthor.current = e.target.value)}
            className="mb-4 w-full border-b border-black py-2 text-xl outline-none"
          />
          <input
            type="submit"
            value="Start Editing"
            className="cursor-pointer rounded-lg bg-[#eee] p-3 transition-all hover:bg-[#ddd]"
          />
        </form>
      </div>
    </main>
  );
}
