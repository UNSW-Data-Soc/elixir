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
  const { status, data } = useSession();
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
  if (!data?.user.admin)
    return (
      <p className="flex justify-center items-center w-full h-[calc(100vh-10rem)] text-3xl">
        You do not have permission to edit blogs. Contact IT if you think this is a mistake.
      </p>
    );
  if (!editorContext.editor) return <></>;
  if (!blogSlug || !validBlog) return <BlogsList />; // TODO: show list of blogs to edit

  return (
    <main className="p-20 py-10 px-10 md:px-32 pl-24 max-w-[900px] mx-auto">
      <BlogsEditInfoForm />
      <div>
        <EditorMenu />
        <EditorContent editor={editorContext.editor} />
      </div>
      <div className="text-sm text-[#555] fixed left-0 bottom-0 p-5 py-3 z-[-1]">
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
      const { blogId, blogTitle, blogAuthor, blogPublic, blogBody } = editorContext.get;
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
      <div
        className="fixed bottom-0 right-0 xl:right-4 xl:top-20 xl:z-40 sm:p-8 py-6 bg-white hover:bg-[#fafafa] transition-colors cursor-pointer xl:max-w-[calc(50vw-450px)] whitespace-pre-wrap text-right rounded-2xl flex flex-row xl:flex-col"
        onClick={() => onOpen()}
      >
        <h2 className="text-4xl md:text-6xl">{editorContext.get.blogTitle}</h2>
        <hr className="hidden xl:block my-6" />
        <p className="text-lg md:text-3xl">{editorContext.get.blogAuthor}</p>
      </div>
      <Modal isOpen={isOpen} isDismissable={true} backdrop="opaque" onClose={onClose}>
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
