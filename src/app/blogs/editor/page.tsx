"use client";

import { useSearchParams } from "next/navigation";
import { EditorContent } from "@tiptap/react";
import EditorMenu from "./editorMenu";
import { useEditorContext } from "./editorContext";
import { endpoints } from "@/app/api/backend/endpoints";
import { useEffect } from "react";

const Tiptap = () => {
  const editorContext = useEditorContext();
  const searchParams = useSearchParams();
  const blogSlug = searchParams.get("blogSlug");

  useEffect(() => {
    const getBlog = async () => {
      if (!blogSlug) return null;
      const blog = await endpoints.blogs.get({ slug: blogSlug, authRequired: true });
      return blog;
    };

    getBlog().then((blog) => {
      console.log(blog);
      if (!blog) return;
      editorContext.set.blogId(blog.id);
      editorContext.set.blogTitle(blog.title);
      editorContext.set.blogAuthor(blog.author);
      editorContext.set.blogPublic(blog.public);
      editorContext.set.blogBody(blog.body);
      editorContext.editor?.commands.setContent(JSON.parse(blog.body));
    });
  }, [blogSlug, editorContext.editor]);

  if (!editorContext.editor) return <></>;
  if (!blogSlug) return <></>; // TODO: show list of blogs to edit

  // console.log(JSON.stringify(editorContext.editor.getJSON()));

  return (
    <main className="p-20 py-10 px-32 max-w-[900px] mx-auto">
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

export default Tiptap;
