import Head from "next/head";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team | DataSoc",
  description:
    "Meet the DataSoc team working to create new opportunities for students to connect, grow and feel supported.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Our Team | UNSW DataSoc</title>
        <meta
          key="description"
          name="description"
          content="Meet the DataSoc team working to create new opportunities for students to connect, grow and feel supported."
        />
      </Head>
      {children}
    </>
  );
}
