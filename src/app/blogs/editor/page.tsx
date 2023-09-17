"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EditorContent } from "@tiptap/react";
import EditorMenu from "./editorMenu";
import { useEditorContext } from "./editorContext";
import { endpoints } from "@/app/api/backend/endpoints";
import { FormEventHandler, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Blog } from "@/app/api/backend/blogs";
import { Input, Modal, ModalContent, useDisclosure } from "@nextui-org/react";

const BlogsEditor = () => {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const editorContext = useEditorContext();
  const searchParams = useSearchParams();
  const blogSlug = searchParams.get("blogSlug");
  const [validBlog, setValidBlog] = useState(true);

  // initially load blog info + content into the editor
  useEffect(() => {
    const getBlog = async () => {
      if (!blogSlug) return null;
      try {
        const blog = await endpoints.blogs.get({ slug: blogSlug, authRequired: true });
        return blog;
      } catch (e) {
        return null;
      }
    };

    getBlog().then((blog) => {
      if (!blog) {
        setValidBlog(false);
        return;
      }
      setValidBlog(true);
      editorContext.set.blogId(blog.id);
      editorContext.set.blogTitle(blog.title);
      editorContext.set.blogAuthor(blog.author);
      editorContext.set.blogPublic(blog.public);
      editorContext.set.blogBody(blog.body);
      editorContext.editor?.commands.setContent(JSON.parse(blog.body));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, blogSlug, editorContext.editor]);

  if (status === "loading") return <></>;
  if (status === "unauthenticated") router.push("/auth/login");
  if (!editorContext.editor) return <></>;
  if (!blogSlug || !validBlog) return <BlogsList />; // TODO: show list of blogs to edit

  return (
    <main className="p-20 py-10 px-32 max-w-[900px] mx-auto">
      <div>
        <EditorMenu />
        <EditorContent editor={editorContext.editor} />
      </div>
      <div className="text-sm text-[#555] fixed left-0 bottom-0 p-5 py-3 z-[-1]">
        <p>Click anywhere outside the blog post to save!</p>
      </div>
      <BlogsEditInfoForm />
    </main>
  );
};

const BlogsEditInfoForm = () => {
  const editorContext = useEditorContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const updateDatabase = async () => {
      const { blogId, blogTitle, blogAuthor, blogPublic, blogBody } = editorContext.get;
      if (!blogId || !blogTitle || !blogAuthor || !blogPublic || !blogBody) {
        return;
      }
      await endpoints.blogs.update({
        id: blogId,
        body: blogBody,
        author: blogAuthor,
        title: blogTitle,
        blogPublic,
      });

      onClose();
    };

    await updateDatabase();
  };

  return (
    <>
      <div
        className="fixed right-4 top-20 z-40 p-5 py-3 bg-[#fafafa] hover:bg-[#eee] transition-colors cursor-pointer max-w-[calc(100vw-1000px)] whitespace-pre-wrap"
        onClick={() => onOpen()}
      >
        <h2 className="text-2xl">{editorContext.get.blogTitle}</h2>
        <p className="text-xl">{editorContext.get.blogAuthor}</p>
      </div>
      <Modal isOpen={isOpen} isDismissable={true} backdrop="opaque">
        <ModalContent>
          <form onSubmit={handleFormSubmit} className="p-10 flex flex-col gap-8">
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
            <Input type="submit" />
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
    <main className="flex flex-col w-full items-center p-10 gap-5 max-w-[800px] mx-auto">
      <p className="text-2xl">
        Seems like you&apos;re trying to edit a blog that doesn&apos;t exist.
      </p>
      <p className="text-xl font-light">Did you want to edit one of these blogs instead?</p>
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="flex flex-row cursor-pointer bg-[#fafafa] hover:bg-[#eee] p-5 w-full transition-all rounded-lg"
          onClick={() => router.push(`/blogs/editor?blogSlug=${blog.slug}`)}
        >
          <div style={{ backgroundImage: `/kentosoc.jpeg` }} className="aspect-square h-full" />
          <div>
            <h3>{blog.title}</h3>
            <p>{blog.author}</p>
          </div>
        </div>
      ))}
    </main>
  );
};

export default BlogsEditor;
