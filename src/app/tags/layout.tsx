import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags | DataSoc",
  description:
    "Manage the tags that are used to categorise blogs, events and resources.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
