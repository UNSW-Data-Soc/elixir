import Head from "next/head";
import EditorContextProvider from "./editorContext";

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Blogs Editor</title>
      </Head>
      <div>
        <EditorContextProvider>{children}</EditorContextProvider>
      </div>
    </>
  );
}
