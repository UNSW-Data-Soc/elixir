import Head from "next/head";
import EditorContextProvider from "./editorContext";
// import { SessionProvider } from "next-auth/react";

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <SessionProvider> */}
      <Head>
        <title>Blogs Editor</title>
      </Head>
      <div>
        <EditorContextProvider>{children}</EditorContextProvider>
      </div>
      {/* </SessionProvider> */}
    </>
  );
}
