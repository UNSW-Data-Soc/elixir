import EditorContextProvider from "./editorContext";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs Editor | DataSoc",
  description: "Edit blog posts on the website.",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EditorContextProvider>{children}</EditorContextProvider>;
}
