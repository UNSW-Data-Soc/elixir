import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import BaseHeading from "@tiptap/extension-heading";
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

import { mergeAttributes } from "@tiptap/core";

type Levels = 1 | 2 | 3;

const classes: Record<Levels, string> = {
  1: "text-4xl",
  2: "text-3xl",
  3: "text-2xl",
};

export const Heading = BaseHeading.configure({ levels: [1, 2, 3] }).extend({
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level: Levels = hasLevel ? node.attrs.level : this.options.levels[0];

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `${classes[level]}`,
      }),
      0,
    ];
  },
});

export const TIPTAP_EXTENSIONS = [
  Document,
  Paragraph.configure({
    HTMLAttributes: {
      class: "text-justify min-h-[1rem]",
    },
  }),
  Text,
  Heading,
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
