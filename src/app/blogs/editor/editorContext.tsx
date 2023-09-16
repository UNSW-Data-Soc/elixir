"use client";

import { Editor, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Strike from "@tiptap/extension-strike";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import Image from "@tiptap/extension-image";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Blockquote from "@tiptap/extension-blockquote";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { endpoints } from "@/app/api/backend/endpoints";
// import Heading1 from "./nodes/heading1";

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

export default function EditorContextProvider({ children }: { children: React.ReactNode }) {
  const [blogId, setBlogId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState<string | null>(null);
  const [blogAuthor, setBlogAuthor] = useState<string | null>(null);
  const [blogPublic, setBlogPublic] = useState<boolean | null>(null);
  const [blogBody, setBlogBody] = useState<string | null>(null);
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "prose max-w-none outline-none pt-20",
      },
    },
    extensions: [
      Document,
      Paragraph.configure({
        HTMLAttributes: {
          class: "text-justify",
        },
      }),
      Text,
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "text-3xl",
        },
      }),
      // Heading1,
      Strike,
      Bold,
      Italic,
      Code,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: "w-full",
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "my-2",
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-3 border-slate-200 pl-4 ml-4 my-2",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-8",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-8",
        },
      }),
      ListItem,
      Link.configure({
        protocols: ["mailto"],
        openOnClick: false,
        // validate: (href) => /^https?:\/\//.test(href),
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
    ],
    content: blogBody ?? "",
    autofocus: false,
    onBlur: ({ editor }) => {
      console.log(blogId, blogTitle, blogAuthor, blogPublic);
      if (blogId === null || blogTitle === null || blogAuthor === null || blogPublic === null) {
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

  return <EditorContext.Provider value={{ editor, get, set }}>{children}</EditorContext.Provider>;
}

export const useEditorContext = () => {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error("useEditorContext must be used within EditorContextProvider");
  }

  return context;
};
