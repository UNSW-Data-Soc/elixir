import Head from "next/head";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags | DataSoc",
  description:
    "Manage the tags that are used to categorise blogs, events and resources.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Tags | UNSW DataSoc</title>
        <meta
          key="description"
          name="description"
          content="Manage the tags that are used to categorise blogs, events and resources."
        />
      </Head>
      {children}
    </>
  );
}
