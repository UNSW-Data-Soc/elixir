import Head from "next/head";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Cover Photo | DataSoc",
  description: "Update the cover photo on the homepage.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Upload Cover Photo | UNSW DataSoc</title>
        <meta
          key="description"
          name="description"
          content="Update the cover photo on the homepage."
        />
      </Head>
      {children}
    </>
  );
}
