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

export const TIPTAP_EXTENSIONS = [
  Document,
  Paragraph.configure({
    HTMLAttributes: {
      class: "text-justify min-h-[1rem]",
    },
  }),
  Text,
  Heading.configure({
    levels: [1, 2, 3],
    HTMLAttributes: {
      class: "text-3xl",
    },
  }),
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
];
