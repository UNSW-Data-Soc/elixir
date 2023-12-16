"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EditorContent } from "@tiptap/react";
import EditorMenu from "./editorMenu";
import { useEditorContext } from "./editorContext";
import { endpoints } from "@/app/api/backend/endpoints";
import { FormEventHandler, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Blog } from "@/app/api/backend/blogs";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { isModerator } from "@/app/utils";
import Link from "next/link";
import { api } from "@/trpc/react";

const BlogsEditor = () => {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const editorContext = useEditorContext();
  const searchParams = useSearchParams();
  const blogSlug = searchParams.get("blogSlug");

  const [validBlog, setValidBlog] = useState(true);

  const { data: blog } = api.blogs.getBySlug.useQuery({ slug: blogSlug ?? "" });

  // initially load blog info + content into the editor
  useEffect(() => {
    // const getBlog = async () => {
    //   if (!blogSlug) return null;
    //   try {
    //     const blog = await endpoints.blogs.get({
    //       slug: blogSlug,
    //       authRequired: true,
    //     });
    //     return blog;
    //   } catch (e) {
    //     return null;
    //   }
    // };
    // getBlog().then((blog) => {
    //   if (!blog) {
    //     setValidBlog(false);
    //     return;
    //   }
    //   setValidBlog(true);
    //   editorContext.set.blogId(blog.id);
    //   editorContext.set.blogTitle(blog.title);
    //   editorContext.set.blogAuthor(blog.author);
    //   editorContext.set.blogPublic(blog.public);
    //   editorContext.set.blogBody(blog.body);
    //   editorContext.editor?.commands.setContent(JSON.parse(blog.body));
    // });
    if (!blog) return;
    editorContext.set.blogId(blog.id);
    editorContext.set.blogTitle(blog.title);
    editorContext.set.blogAuthor(blog.author);
    editorContext.set.blogPublic(blog.public);
    editorContext.set.blogBody(blog.body);
    editorContext.editor?.commands.setContent(JSON.parse(blog.body));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, blogSlug, editorContext.editor, blog]);

  if (session.status === "loading") return <></>;
  if (session.status === "unauthenticated") router.push("/auth/login");
  if (!isModerator(session.data))
    return (
      <p className="flex h-[calc(100vh-10rem)] w-full items-center justify-center text-3xl">
        You do not have permission to edit blogs. Contact IT if you think this
        is a mistake.
      </p>
    );
  if (!editorContext.editor) return <></>;
  if (!blogSlug || !validBlog) return <BlogsList />; // TODO: show list of blogs to edit

  return (
    <main className="mx-auto max-w-[900px] p-20 px-10 py-10 pl-24 md:px-32">
      <BlogsEditInfoForm />
      <div>
        <EditorMenu />
        <EditorContent editor={editorContext.editor} />
      </div>
      <div className="fixed bottom-0 left-0 z-[-1] p-5 py-3 text-sm text-[#555]">
        <p>Click anywhere outside the blog post to save!</p>
      </div>
    </main>
  );
};

const BlogsEditInfoForm = () => {
  const router = useRouter();
  const editorContext = useEditorContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const updateDatabase = async () => {
      const { blogId, blogTitle, blogAuthor, blogPublic, blogBody } =
        editorContext.get;
      if (!blogId || !blogTitle || !blogAuthor || !blogPublic || !blogBody) {
        return;
      }
      const blog = await endpoints.blogs.update({
        id: blogId,
        body: blogBody,
        author: blogAuthor,
        title: blogTitle,
        blogPublic,
      });

      onClose();

      // if we change the title, the slug will change, so navigate to the new slug
      router.push(`/blogs/editor?blogSlug=${blog.slug}`);
    };

    await updateDatabase();
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
        onClose={onClose}
      >
        <ModalContent>
          <form
            onSubmit={handleFormSubmit}
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
              style={{ cursor: "pointer" }}
            />
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

const BlogsList = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const getBlogs = async () => {
      return await endpoints.blogs.getAll({ authRequired: true });
    };

    getBlogs().then((blogs) => {
      setBlogs(blogs);
    });
  }, []);

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
          onClick={() => router.push(`/blogs/editor?blogSlug=${blog.slug}`)}
        >
          <div
            style={{ backgroundImage: `/kentosoc.jpeg` }}
            className="aspect-square h-full"
          />
          <div>
            <h3>{blog.title}</h3>
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
