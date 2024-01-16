import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs Creator | DataSoc",
  description: "Create a new blog post on the website.",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
