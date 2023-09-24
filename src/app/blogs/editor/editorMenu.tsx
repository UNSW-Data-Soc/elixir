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
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import { FileUploadDropzone, IMAGE_FILE_TYPES } from "@/app/utils";
import toast from "react-hot-toast";
import { BACKEND_URL, endpoints } from "@/app/api/backend/endpoints";

export default function EditorMenu() {
  const { editor } = useEditorContext();

  if (!editor) return <></>;

  return (
    <div className="fixed top-28 translate-x-[-170%] z-50 bg-[#fafafa] flex flex-col justify-start border-[0.5px] border-[#ddd] items-center rounded-lg shadow-lg">
      <EditorMenuGroup bottomBorder={false}>
        <button
          className={`p-2 ${
            editor.isActive("heading", {
              level: 1,
            })
              ? "bg-slate-300"
              : "bg-transparent"
          } hover:bg-slate-200 transition-all rounded-lg`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
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
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
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
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <H3Icon />
        </button>
        <button
          className={`p-2 ${
            editor.isActive("paragraph") ? "bg-slate-300" : "bg-transparent"
          } hover:bg-slate-200 transition-all rounded-lg`}
          onClick={() => editor.chain().focus().setParagraph().run()}
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
  const {
    editor,
    get: { blogId },
  } = useEditorContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageUrl, setImageUrl] = useState<string>("");
  if (!editor || !blogId) return <></>;

  return (
    <>
      <button
        className={`p-2 hover:bg-slate-200 transition-all rounded-lg ${
          isOpen || editor.isActive("image") ? "bg-slate-200" : "bg-transparent"
        }}`}
        onClick={onOpen}
      >
        <ImageIcon />
      </button>
      <Modal isOpen={isOpen} isDismissable={true} backdrop="opaque" onClose={onClose}>
        <ModalContent className={`p-5 flex flex-col gap-3`}>
          <h3 className="text-2xl text-center lowercase font-light">Insert an image</h3>
          <form
            className={`flex flex-col gap-2`}
            onSubmit={(e) => {
              e.preventDefault();

              if (!imageUrl) return;

              editor.commands.setImage({ src: imageUrl });
              onClose();
              setImageUrl("");
            }}
          >
            <input
              type="text"
              placeholder="image url..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="outline-none bg-[#f7f7f7] focus:bg-[#eee] p-2 px-3 transition-all rounded-lg"
            />
          </form>
          <label className="text-center">----- OR -----</label>
          <form
            className={`flex flex-col gap-2`}
            onSubmit={(e) => {
              e.preventDefault();

              if (!imageUrl) return;

              editor.commands.setImage({ src: imageUrl });
              onClose();
              setImageUrl("");
            }}
          >
            <FileUploadDropzone
              handleFileChange={async (e) => {
                const files = e.target.files;
                if (!files || !IMAGE_FILE_TYPES.includes(files[0].type)) {
                  toast.error("Please upload a valid image!");
                  return;
                }

                const { id: imageId } = await endpoints.blogs.image.upload({
                  blogId,
                  file: files[0],
                });
                const imageURL = new URL("/file/blog", BACKEND_URL);
                imageURL.searchParams.append("blog_id", blogId);
                imageURL.searchParams.append("photo_id", imageId);
                editor.commands.setImage({ src: imageURL.href });

                onClose();
                setImageUrl("");
              }}
            />
          </form>
        </ModalContent>
      </Modal>
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
  bottomBorder = true,
}: {
  children: React.ReactNode;
  bottomBorder?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col justify-start items-center ${
        bottomBorder ? "border-t" : ""
      } py-2 px-2 gap-1`}
    >
      {children}
    </div>
  );
};
