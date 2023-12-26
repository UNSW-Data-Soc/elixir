"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useSession } from "next-auth/react";

import { useEffect } from "react";

import {
  Button,
  Input,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";

import { api } from "@/trpc/react";

import { Spinner, isModerator } from "@/app/utils";

import { EditorContent } from "@tiptap/react";

import { useEditorContext } from "./editorContext";
import EditorMenu from "./editorMenu";

import toast from "react-hot-toast";

const BlogsEditor = () => {
  const session = useSession();
  const router = useRouter();
  const editorContext = useEditorContext();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("blogId");

  const {
    data: blog,
    isLoading: blogLoading,
    isError: blogError,
  } = api.blogs.getById.useQuery(
    {
      id: blogId ?? "",
    },
    {
      retry: 3, // number of times to retry on failure (default is 2)
    },
  );

  // initially load blog info + content into the editor
  useEffect(() => {
    if (!blog) return;
    editorContext.set.blogId(blog.id);
    editorContext.set.blogTitle(blog.title);
    editorContext.set.blogAuthor(blog.author);
    editorContext.set.blogPublic(blog.public);
    editorContext.set.blogBody(blog.body);
    editorContext.editor?.commands.setContent(JSON.parse(blog.body));
  }, [blog]);

  if (session.status === "loading") return <></>;
  if (session.status === "unauthenticated") router.push("/auth/login");
  if (!isModerator(session.data))
    return (
      <p className="flex h-[calc(100vh-10rem)] w-full items-center justify-center text-3xl">
        You do not have permission to edit blogs. Contact IT if you think this
        is a mistake.
      </p>
    );
  if (!editorContext.editor) return <>Error!</>;
  if (!blogId || blogError) return <BlogsList />;

  return (
    <main className="mx-auto max-w-[900px] p-20 px-10 py-10 pl-24 md:px-32">
      {blogLoading && <Spinner />}
      {!!blog && (
        <>
          <BlogsEditInfoForm />
          <div>
            <EditorMenu />
            <EditorContent editor={editorContext.editor} />
          </div>
          <div className="fixed bottom-0 left-0 z-[-1] p-5 py-3 text-sm text-[#555]">
            <p>Click anywhere outside the blog post to save!</p>
          </div>
        </>
      )}
    </main>
  );
};

const BlogsEditInfoForm = () => {
  const editorContext = useEditorContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutate: updateBlog } = api.blogs.update.useMutation({
    onSuccess: () => {
      toast.success("Title + author updated!");
    },
    onError: () => {
      toast.error("Failed to update blog title / author.");
    },
    onSettled: () => {
      onClose();
    },
  });

  const handleFormSubmit = () => {
    const { blogId, blogTitle, blogAuthor, blogPublic, blogBody } =
      editorContext.get;
    if (!blogId || !blogTitle || !blogAuthor || !blogPublic || !blogBody) {
      return;
    }

    updateBlog({
      id: blogId,
      title: blogTitle,
      body: blogBody,
      author: blogAuthor,
    });
  };

  return (
    <>
      <div className="relative flex flex-col gap-4">
        <h1 className="text-6xl font-light tracking-tighter">
          {editorContext.get.blogTitle}
        </h1>
        <p className="text-xl font-light text-[#555]">
          Written by{" "}
          <span className="italic">{editorContext.get.blogAuthor}</span>
        </p>
        <Button
          className="hover:bg-[# absolute bottom-0 right-0 bg-[#0002] backdrop-blur-sm"
          onClick={() => onOpen()}
        >
          edit title / author
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        isDismissable={true}
        backdrop="opaque"
        onClose={() => {
          handleFormSubmit();
          onClose();
        }}
      >
        <ModalContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFormSubmit();
            }}
            className="flex flex-col gap-8 p-10"
          >
            <Input
              type="text"
              label="title"
              value={editorContext.get.blogTitle ?? ""}
              onChange={(e) => editorContext.set.blogTitle(e.target.value)}
            />
            <Input
              type="text"
              label="author"
              value={editorContext.get.blogAuthor ?? ""}
              onChange={(e) => editorContext.set.blogAuthor(e.target.value)}
            />
            <Input
              type="submit"
              value="Save changes"
              className="cursor-pointer"
            />
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

const BlogsList = () => {
  const router = useRouter();

  const { data: blogs, isLoading, isError } = api.blogs.getAll.useQuery();

  if (isLoading) return <Spinner />;
  if (isError) return <>Error!</>;

  return (
    <main className="mx-auto flex w-full max-w-[800px] flex-col items-center gap-5 p-10">
      <p className="text-2xl">
        Seems like you&apos;re trying to edit a blog that doesn&apos;t exist.
      </p>
      <p className="text-xl font-light">
        Did you want to edit one of these blogs instead?
      </p>
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="flex w-full cursor-pointer flex-row rounded-lg bg-[#fafafa] p-5 transition-all hover:bg-[#eee]"
          onClick={() => router.push(`/blogs/editor?blogId=${blog.id}`)}
        >
          <div>
            <h3 className="text-lg font-bold">{blog.title}</h3>
            <p>{blog.author}</p>
          </div>
        </div>
      ))}
      {blogs.length === 0 && (
        <p>
          No blogs to edit! Click <Link href="/blogs/create">here</Link> to
          create one.
        </p>
      )}
    </main>
  );
};

export default BlogsEditor;
