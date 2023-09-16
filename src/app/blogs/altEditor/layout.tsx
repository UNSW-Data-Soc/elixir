import EditorContextProvider from "./editorContext";

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <EditorContextProvider>{children}</EditorContextProvider>
    </div>
  );
}
