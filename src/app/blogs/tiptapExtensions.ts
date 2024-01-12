import { mergeAttributes } from "@tiptap/core";
import { Node } from "@tiptap/core";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import BaseHeading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";

import { getBlogImageRoute } from "../utils/s3";

type Levels = 1 | 2 | 3;

const classes: Record<Levels, string> = {
  1: "text-3xl mb-2",
  2: "text-2xl mb-2",
  3: "text-xl mb-2",
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

export const UploadImage = Image.extend({
  name: "image",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      blogId: { default: null },
      imageId: { default: null },
    };
  },
  parseHTML() {
    return [
      {
        tag: "img",
      },
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      `img`,
      mergeAttributes(HTMLAttributes, {
        src: node.attrs.src
          ? node.attrs.src
          : getBlogImageRoute(node.attrs.blogId, node.attrs.imageId),
      }),
    ];
  },
  addCommands() {
    return {
      setImage:
        (options: {
          src?: string;
          alt?: string;
          title?: string;
          blogId?: string;
          imageId?: string;
        }) =>
        ({ tr, dispatch }) => {
          const { selection } = tr;
          // @ts-ignore
          const position = selection.$cursor
            ? // @ts-ignore
              selection.$cursor.pos
            : selection.$to.pos;
          const node = this.type.create(options);

          if (dispatch) {
            tr.replaceRangeWith(position, position, node);
          }

          return true;
        },
    };
  },
});

export const TIPTAP_EXTENSIONS = [
  Document,
  Paragraph.configure({
    HTMLAttributes: {
      class: "text-start sm:text-justify min-h-[1rem]",
    },
  }),
  Text,
  Heading,
  Strike,
  Bold,
  Italic,
  Code,
  Underline,
  UploadImage.configure({
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
      class: "border-l-3 border-slate-300 p-4 my-2 bg-[#f5f5f5]",
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
      class: "no-underline text-blue-500 hover:text-blue-700 transition-colors",
    },
  }),
  Embed,
  Script,
  BubbleMenu,
  History,
  Typography,
  Dropcursor,
  Gapcursor,
];
