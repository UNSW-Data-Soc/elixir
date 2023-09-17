import { Editor } from "@tiptap/react";
import {
  BoldIcon,
  CodeIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  OLIcon,
  PIcon,
  QuoteIcon,
  StrikeIcon,
  ULIcon,
  UnderlineIcon,
  UnlinkIcon,
} from "./icons";
import { useEditorContext } from "./editorContext";
import { useState } from "react";
import useClickAway from "@/app/hooks/useClickAway";

export default function EditorMenu() {
  const { editor } = useEditorContext();

  if (!editor) return <></>;

  return (
    <div className="fixed top-28 z-50 bg-[#fafafa] flex flex-row justify-start border-[0.5px] border-[#ddd] items-center rounded-lg overflow-hidden shadow-lg">
      <EditorMenuGroup leftBorder={false}>
        <button
          className={`p-2 ${
            editor.isActive("heading", {
              level: 1,
            })
              ? "bg-slate-300"
              : "bg-transparent"
          } hover:bg-slate-200 transition-all rounded-lg`}
          onClick={() => editor.commands.toggleHeading({ level: 1 })}
        >
          <H1Icon />
        </button>
        <button
          className={`p-2 ${
            editor.isActive("heading", {
              level: 2,
            })
              ? "bg-slate-300"
              : "bg-transparent"
          } hover:bg-slate-200 transition-all rounded-lg`}
          onClick={() => editor.commands.toggleHeading({ level: 2 })}
        >
          <H2Icon />
        </button>
        <button
          className={`p-2 ${
            editor.isActive("heading", {
              level: 3,
            })
              ? "bg-slate-300"
              : "bg-transparent"
          } hover:bg-slate-200 transition-all rounded-lg`}
          onClick={() => editor.commands.toggleHeading({ level: 3 })}
        >
          <H3Icon />
        </button>
        <button
          className={`p-2 ${
            editor.isActive("paragraph") ? "bg-slate-300" : "bg-transparent"
          } hover:bg-slate-200 transition-all rounded-lg`}
          onClick={() => editor.commands.setParagraph()}
        >
          <PIcon />
        </button>
      </EditorMenuGroup>
      <EditorMenuGroup>
        <button
          className={`p-2 ${
            editor.isActive("bold") ? "bg-slate-300" : "bg-transparent"
          } hover:bg-slate-200 transition-all rounded-lg`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon />
        </button>
        <button
          className={`p-2 ${
            editor.isActive("italic") ? "bg-slate-300" : "bg-transparent"
          } hover:bg-slate-200 transition-all rounded-lg`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon />
        </button>
        <button
          className={`p-2 ${
            editor.isActive("underline") ? "bg-slate-300" : "bg-transparent"
          } hover:bg-slate-200 transition-all rounded-lg`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon />
        </button>
        <button
          className={`p-2 ${
            editor.isActive("strike") ? "bg-slate-300" : "bg-transparent"
          } hover:bg-slate-200 transition-all rounded-lg`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <StrikeIcon />
        </button>
        <button
          className={`p-2 ${
            editor.isActive("code") ? "bg-slate-300" : "bg-transparent"
          } hover:bg-slate-200 transition-all rounded-lg`}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <CodeIcon />
        </button>
      </EditorMenuGroup>
      <EditorMenuGroup>
        <EditorAddLink />
        <EditorAddImage />
        <button
          className={`p-2 ${
            editor.isActive("blockquote") ? "bg-slate-300" : "bg-transparent"
          } hover:bg-slate-200 transition-all rounded-lg`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <QuoteIcon />
        </button>
        <button
          className={`p-2 ${
            editor.isActive("bulletList") ? "bg-slate-300" : "bg-transparent"
          } hover:bg-slate-200 transition-all rounded-lg`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ULIcon />
        </button>
        <button
          className={`p-2 ${
            editor.isActive("orderedList") ? "bg-slate-300" : "bg-transparent"
          } hover:bg-slate-200 transition-all rounded-lg`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <OLIcon />
        </button>
      </EditorMenuGroup>
    </div>
  );
}

const EditorAddImage = () => {
  const { editor } = useEditorContext();
  const [showImageAdd, setShowImageAdd] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const clickAwayRef = useClickAway(() => setShowImageAdd(false));
  if (!editor) return <></>;

  return (
    <>
      <button
        className={`p-2 hover:bg-slate-200 transition-all rounded-lg ${
          showImageAdd || editor.isActive("image") ? "bg-slate-200" : "bg-transparent"
        }}`}
        onClick={() => setShowImageAdd((prev) => !prev)}
      >
        <ImageIcon />
      </button>
      <form
        ref={clickAwayRef}
        className={`absolute ${
          showImageAdd ? "opacity-100 w-auto h-auto z-30" : "z-[-10] opacity-0"
        } bg-white shadow-xl rounded-md flex flex-row items-center gap-2 transition-all overflow-hidden translate-x-10`}
        onSubmit={(e) => {
          e.preventDefault();

          if (!imageUrl) return;

          editor.commands.setImage({ src: imageUrl });
          setShowImageAdd(false);
          setImageUrl("");
        }}
      >
        {/* <label>Insert a new image:</label> */}
        <input
          type="text"
          placeholder="image url..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="outline-none focus:bg-[#eee] p-2 px-3 transition-all"
        />
      </form>
    </>
  );
};

const EditorAddLink = () => {
  const { editor } = useEditorContext();
  const [showLinkAdd, setShowLinkAdd] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");
  const clickAwayRef = useClickAway(() => setShowLinkAdd(false));
  if (!editor) return <></>;

  return (
    <>
      <button
        className={`p-2 hover:bg-slate-200 transition-all rounded-lg ${
          showLinkAdd || editor.isActive("link") ? "bg-slate-200" : "bg-white"
        }}`}
        onClick={() => setShowLinkAdd((prev) => !prev)}
      >
        <LinkIcon />
      </button>
      <button
        className={`p-2 hover:bg-slate-200 transition-all rounded-lg ${
          showLinkAdd || editor.isActive("link") ? "bg-slate-200" : "bg-white"
        }}`}
        onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
      >
        <UnlinkIcon />
      </button>
      <form
        ref={clickAwayRef}
        className={`absolute ${
          showLinkAdd ? "opacity-100 w-auto h-auto z-30" : "z-[-10] opacity-0"
        } bg-white shadow-xl rounded-md flex flex-row items-center gap-2 transition-all overflow-hidden translate-x-10`}
        onSubmit={(e) => {
          e.preventDefault();

          if (!link) return;

          // editor.chain().focus().extendMarkRange("link").setLink({ href: link, target: "_blank" });
          editor.commands.setLink({ href: link, target: "_blank" });
          setShowLinkAdd(false);
          setLink("");
        }}
      >
        {/* <label>Insert a new image:</label> */}
        <input
          type="text"
          placeholder="link..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="outline-none focus:bg-[#eee] p-2 px-3 transition-all"
        />
      </form>
    </>
  );
};

const EditorMenuGroup = ({
  children,
  leftBorder = true,
}: {
  children: React.ReactNode;
  leftBorder?: boolean;
}) => {
  return (
    <div
      className={`flex flex-row justify-start items-center ${
        leftBorder ? "border-l" : ""
      } py-1 px-2 gap-1`}
    >
      {children}
    </div>
  );
};
