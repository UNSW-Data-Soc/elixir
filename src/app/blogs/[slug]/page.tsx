import { endpoints } from "@/app/api/backend/endpoints";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { generateHTML } from "@tiptap/html";
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
dayjs.extend(relativeTime);

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession();

  const slug = params.slug;

  const blog = await endpoints.blogs.get({ slug });

  if (!session && !blog.public) {
    return redirect("/auth/login");
  }

  const createdDate = dayjs(Date.parse(blog.created_time)).fromNow();
  const editedDate = dayjs(Date.parse(blog.last_edit_time)).fromNow();

  // TODO: some styling doesn't match
  const content = generateHTML(JSON.parse(blog.body), [
    Document,
    Paragraph,
    Text,
    Heading,
    Strike,
    Bold,
    Italic,
    Underline,
    Code,
    Image,
    HorizontalRule,
    Blockquote,
    OrderedList,
    BulletList,
    ListItem,
    Link,
  ]);

  return (
    <main className="px-10 sm:px-0 sm:max-w-[80%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[60%] 2xl:max-w-[40%] mx-auto py-12">
      <header className="flex flex-col gap-4">
        <h1 className="text-6xl font-light tracking-tighter">{blog.title}</h1>
        <p className="text-[#555] text-xl font-light">
          Written by <span className="italic">{blog.author}</span>
        </p>
        <div className="flex flex-row w-full justify-between">
          <p className="text-[#555] italic">Published {createdDate}</p>
          <p className="text-[#555] italic">Edited {editedDate}</p>
        </div>
      </header>
      <div dangerouslySetInnerHTML={{ __html: content }} className="pt-8"></div>
    </main>
  );
}
