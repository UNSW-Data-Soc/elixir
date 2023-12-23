import Head from "next/head";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs | DataSoc",
  description: "Stay in the loop with our blog posts!",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Blogs | UNSW DataSoc</title>
        <meta
          key="description"
          name="description"
          content="Stay in the loop with our blog posts! From educational guides to
          opinion articles about data science in the real world, they're
          here for you!"
        />
      </Head>
      {children}
    </>
  );
}
