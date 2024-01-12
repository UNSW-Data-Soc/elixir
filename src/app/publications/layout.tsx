import Head from "next/head";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications | DataSoc",
  description:
    "You can find all of our publications here, including our newsletters and guides!",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Publications | UNSW DataSoc</title>
        <meta
          key="description"
          name="description"
          content="You can find all of our publications here, including our newsletters and guides!"
        />
      </Head>
      {children}
    </>
  );
}
