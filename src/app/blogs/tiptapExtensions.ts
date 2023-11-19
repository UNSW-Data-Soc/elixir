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
import History from '@tiptap/extension-history';
import Typography from '@tiptap/extension-typography';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';

import { mergeAttributes } from "@tiptap/core";
import { Node } from "@tiptap/core";
import BubbleMenu from "@tiptap/extension-bubble-menu";

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

export const Embed = Node.create({
  name: "embed",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      width: { default: 560 },
      height: { default: 315 },
      title: { default: "Embed" },
      frameborder: { default: null },
      allow: { default: null },
      allowfullscreen: { default: null },
      srcdoc: { default: null },
    };
  },
  parseHTML() {
    return [
      {
        tag: "iframe",
      },
    ];
  },
  renderHTML({ HTMLAttributes, node }) {
    return [
      `iframe`,
      mergeAttributes(HTMLAttributes, {
        srcdoc: `<img src='${node.attrs.src}/hqdefault.jpg'`,
      }),
    ];
  },
});

export const Script = Node.create({
  name: "script",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      async: { default: false },
      charset: { default: null },
    };
  },
  parseHTML() {
    return [
      {
        tag: "script",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [`script`, mergeAttributes(HTMLAttributes)];
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
  Embed,
  Script,
  BubbleMenu,
  History,
  Typography,
  Dropcursor,
  Gapcursor
];
