"use client";

import { Editor, useEditor } from "@tiptap/react";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { endpoints } from "@/app/api/backend/endpoints";
import { TIPTAP_EXTENSIONS } from "../tiptapExtensions";
// import Heading1 from "./nodes/heading1";

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
      console.log(blogId, blogTitle, blogAuthor, blogPublic);
      if (
        blogId === null ||
        blogTitle === null ||
        blogAuthor === null ||
        blogPublic === null
      ) {
        toast.loading("Blog still loading...", { duration: 3000 });
        return;
      }

      const updateDatabase = async () => {
        console.log(JSON.stringify(editor.getJSON(), null, 4));
        await endpoints.blogs.update({
          id: blogId,
          body: JSON.stringify(editor.getJSON()),
          author: blogAuthor,
          title: blogTitle,
          blogPublic,
        });
      };

      toast.loading("Saving...", { id: "saving" });

      updateDatabase().then(() => {
        setTimeout(() => {
          toast.dismiss("saving");
        }, 500);
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
