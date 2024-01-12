import Head from "next/head";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | DataSoc",
  description:
    "From social events to workshops to networking opportunities, stay updated to make sure you don't miss out!",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Events | UNSW DataSoc</title>
        <meta
          key="description"
          name="description"
          content="From social events to workshops to networking opportunities, stay
          updated to make sure you don't miss out!"
        />
      </Head>
      {children}
    </>
  );
}
