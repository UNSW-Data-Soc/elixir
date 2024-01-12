import Head from "next/head";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | DataSoc",
  description:
    "Missed out on one of our workshops? Want to brush up on some new skills? Well, browse through all of our learning resources from previous events here!",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Resources | UNSW DataSoc</title>
        <meta
          key="description"
          name="description"
          content="Missed out on one of our workshops? Want to brush up on some new
          skills? Well, browse through all of our learning resources from
          previous events here!"
        />
      </Head>
      {children}
    </>
  );
}
