"use client";

import { createContext, useContext, useState } from "react";

import { Editor, useEditor } from "@tiptap/react";
import { TIPTAP_EXTENSIONS } from "../tiptapExtensions";

import toast from "react-hot-toast";

import { api } from "@/trpc/react";

const SAVING_BLOG_TOAST_ID = "saving";

type EditorContextType = {
  editor: Editor | null;
  get: {
    blogId: string | null;
    blogTitle: string | null;
    blogAuthor: string | null;
    blogPublic: boolean | null;
    blogBody: string | null;
  };
  set: {
    blogId: React.Dispatch<React.SetStateAction<string | null>>;
    blogTitle: React.Dispatch<React.SetStateAction<string | null>>;
    blogAuthor: React.Dispatch<React.SetStateAction<string | null>>;
    blogPublic: React.Dispatch<React.SetStateAction<boolean | null>>;
    blogBody: React.Dispatch<React.SetStateAction<string | null>>;
  };
};

const EditorContext = createContext<EditorContextType | null>(null);

export default function EditorContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [blogId, setBlogId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState<string | null>(null);
  const [blogAuthor, setBlogAuthor] = useState<string | null>(null);
  const [blogPublic, setBlogPublic] = useState<boolean | null>(null);
  const [blogBody, setBlogBody] = useState<string | null>(null);
  const { mutate: updateBlog } = api.blogs.update.useMutation({
    onMutate: () => {
      toast.loading("Saving...", { id: SAVING_BLOG_TOAST_ID });
    },
    onSuccess: () => {
      toast.dismiss(SAVING_BLOG_TOAST_ID);
      toast.success("Saved!");
    },
    onError: () => {
      toast.dismiss(SAVING_BLOG_TOAST_ID);
      toast.error("Failed to save blog!");
    },
  });

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "prose max-w-none outline-none pt-4",
      },
    },
    extensions: TIPTAP_EXTENSIONS,
    content: blogBody ?? "",
    autofocus: false,
    onBlur: ({ editor }) => {
      if (
        blogId === null ||
        blogTitle === null ||
        blogAuthor === null ||
        blogPublic === null
      ) {
        toast.loading("Blog still loading...", { duration: 3000 });
        return;
      }

      const blogContent = editor.getJSON();

      updateBlog({
        id: blogId,
        body: JSON.stringify(blogContent),
        author: blogAuthor,
        title: blogTitle,
      });
    },
  });

  const get = {
    blogId,
    blogTitle,
    blogAuthor,
    blogPublic,
    blogBody,
  };
  const set = {
    blogId: setBlogId,
    blogTitle: setBlogTitle,
    blogAuthor: setBlogAuthor,
    blogPublic: setBlogPublic,
    blogBody: setBlogBody,
  };

  return (
    <EditorContext.Provider value={{ editor, get, set }}>
      {children}
    </EditorContext.Provider>
  );
}

export const useEditorContext = () => {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error(
      "useEditorContext must be used within EditorContextProvider",
    );
  }

  return context;
};
