import { useState } from "react";

import { Modal, ModalContent, Tooltip, useDisclosure } from "@nextui-org/react";

import { generateFileId } from "@/server/api/utils";

import { BACKEND_URL, endpoints } from "@/app/api/backend/endpoints";

import useClickAway from "@/app/hooks/useClickAway";
import PhotoUploader from "@/app/photoUploader";
import { FileUploadDropzone, IMAGE_FILE_TYPES } from "@/app/utils";
import { getBlogImageKey, upload } from "@/app/utils/s3";

import { useEditorContext } from "./editorContext";
import {
  BoldIcon,
  CodeIcon,
  EmbedIcon,
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

import toast from "react-hot-toast";

const TOAST_ID_UPLOADING_PHOTO = "uploading-photo";

export default function EditorMenu() {
  const { editor } = useEditorContext();

  if (!editor) return <></>;

  return (
    <div className="fixed top-28 flex translate-x-[-150%] flex-col items-center justify-start rounded-lg border-[0.5px] border-[#ddd] bg-[#fafafa] shadow-lg md:z-40 md:translate-x-[-170%]">
      <EditorMenuGroup bottomBorder={false}>
        <Tooltip
          placement="left"
          content="Heading 1"
          color="default"
          closeDelay={0}
        >
          <button
            className={`p-2 ${
              editor.isActive("heading", {
                level: 1,
              })
                ? "bg-slate-300"
                : "bg-transparent"
            } rounded-lg transition-all hover:bg-slate-200`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <H1Icon />
          </button>
        </Tooltip>
        <Tooltip
          placement="left"
          content="Heading 2"
          color="default"
          closeDelay={0}
        >
          <button
            className={`p-2 ${
              editor.isActive("heading", {
                level: 2,
              })
                ? "bg-slate-300"
                : "bg-transparent"
            } rounded-lg transition-all hover:bg-slate-200`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <H2Icon />
          </button>
        </Tooltip>
        <Tooltip
          placement="left"
          content="Heading 3"
          color="default"
          closeDelay={0}
        >
          <button
            className={`p-2 ${
              editor.isActive("heading", {
                level: 3,
              })
                ? "bg-slate-300"
                : "bg-transparent"
            } rounded-lg transition-all hover:bg-slate-200`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <H3Icon />
          </button>
        </Tooltip>
        <Tooltip placement="left" content="Text" color="default" closeDelay={0}>
          <button
            className={`p-2 ${
              editor.isActive("paragraph") ? "bg-slate-300" : "bg-transparent"
            } rounded-lg transition-all hover:bg-slate-200`}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            <PIcon />
          </button>
        </Tooltip>
      </EditorMenuGroup>
      <EditorMenuGroup>
        <Tooltip placement="left" content="Bold" color="default" closeDelay={0}>
          <button
            className={`p-2 ${
              editor.isActive("bold") ? "bg-slate-300" : "bg-transparent"
            } rounded-lg transition-all hover:bg-slate-200`}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <BoldIcon />
          </button>
        </Tooltip>
        <Tooltip
          placement="left"
          content="Italic"
          color="default"
          closeDelay={0}
        >
          <button
            className={`p-2 ${
              editor.isActive("italic") ? "bg-slate-300" : "bg-transparent"
            } rounded-lg transition-all hover:bg-slate-200`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <ItalicIcon />
          </button>
        </Tooltip>
        <Tooltip
          placement="left"
          content="Underline"
          color="default"
          closeDelay={0}
        >
          <button
            className={`p-2 ${
              editor.isActive("underline") ? "bg-slate-300" : "bg-transparent"
            } rounded-lg transition-all hover:bg-slate-200`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon />
          </button>
        </Tooltip>
        <Tooltip
          placement="left"
          content="Strikethrough"
          color="default"
          closeDelay={0}
        >
          <button
            className={`p-2 ${
              editor.isActive("strike") ? "bg-slate-300" : "bg-transparent"
            } rounded-lg transition-all hover:bg-slate-200`}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <StrikeIcon />
          </button>
        </Tooltip>
        <Tooltip placement="left" content="Code" color="default" closeDelay={0}>
          <button
            className={`p-2 ${
              editor.isActive("code") ? "bg-slate-300" : "bg-transparent"
            } rounded-lg transition-all hover:bg-slate-200`}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <CodeIcon />
          </button>
        </Tooltip>
      </EditorMenuGroup>
      <EditorMenuGroup>
        <EditorAddLink />
        <EditorAddImage />
        <EditorAddEmbed />
        <Tooltip
          placement="left"
          content="Quote"
          color="default"
          closeDelay={0}
        >
          <button
            className={`p-2 ${
              editor.isActive("blockquote") ? "bg-slate-300" : "bg-transparent"
            } rounded-lg transition-all hover:bg-slate-200`}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <QuoteIcon />
          </button>
        </Tooltip>
        <Tooltip
          placement="left"
          content="Bullet List"
          color="default"
          closeDelay={0}
        >
          <button
            className={`p-2 ${
              editor.isActive("bulletList") ? "bg-slate-300" : "bg-transparent"
            } rounded-lg transition-all hover:bg-slate-200`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <ULIcon />
          </button>
        </Tooltip>
        <Tooltip
          placement="left"
          content="Numbered List"
          color="default"
          closeDelay={0}
        >
          <button
            className={`p-2 ${
              editor.isActive("orderedList") ? "bg-slate-300" : "bg-transparent"
            } rounded-lg transition-all hover:bg-slate-200`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <OLIcon />
          </button>
        </Tooltip>
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
      <Tooltip placement="left" content="Image" color="default" closeDelay={0}>
        <button
          className={`rounded-lg p-2 transition-all hover:bg-slate-200 ${
            isOpen || editor.isActive("image")
              ? "bg-slate-200"
              : "bg-transparent"
          }}`}
          onClick={onOpen}
        >
          <ImageIcon />
        </button>
      </Tooltip>
      <Modal
        isOpen={isOpen}
        isDismissable={true}
        backdrop="opaque"
        onClose={onClose}
      >
        <ModalContent className={`flex flex-col gap-3 p-5`}>
          <h3 className="text-center text-2xl font-light lowercase">
            Insert an image
          </h3>
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
              className="rounded-lg bg-[#f7f7f7] p-2 px-3 outline-none transition-all focus:bg-[#eee]"
            />
            <input
              type="submit"
              value="Upload"
              className="cursor-pointer rounded-lg bg-[#eee] p-3 transition-all hover:bg-[#ddd]"
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
                if (
                  !files ||
                  files.length === 0 ||
                  !IMAGE_FILE_TYPES.includes(files[0].type)
                ) {
                  toast.error("Please upload a valid image!");
                  return;
                }

                const imageId = generateFileId(files[0].type);

                try {
                  toast.loading("Uploading image...", {
                    id: TOAST_ID_UPLOADING_PHOTO,
                  });
                  await upload(files[0], getBlogImageKey(blogId, imageId));
                  toast.dismiss(TOAST_ID_UPLOADING_PHOTO);
                } catch (err) {
                  toast.dismiss(TOAST_ID_UPLOADING_PHOTO);
                  toast.error("Error uploading image!");
                  return;
                }

                toast.success("Image uploaded!");

                editor.commands.setImage({
                  // @ts-ignore
                  src: null,
                  imageId,
                  blogId,
                });

                onClose();
                setImageUrl("");
              }}
            />
            {/* TODO: change to use PhotoUploader eventually */}
            {/* <PhotoUploader
              uploadCroppedPhoto={async (file: Blob) => {
                const { id: imageId } = await endpoints.blogs.image.upload({
                  blogId,
                  file,
                });
                const imageURL = new URL("/file/blog", BACKEND_URL);
                imageURL.searchParams.append("blog_id", blogId);
                imageURL.searchParams.append("photo_id", imageId);
                editor.commands.setImage({ src: imageURL.href });

                onClose();
                setImageUrl("");
              }}
              xPixels={0}
              yPixels={0}
              cancelUploadingCroppedPhoto={() => {
                // TODO
                throw new Error("Function not implemented.");
              }}
            /> */}
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

const EditorAddEmbed = () => {
  const { editor } = useEditorContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [embed, setEmbed] = useState<string>("");
  if (!editor) return <></>;

  return (
    <>
      <Tooltip placement="left" content="Embed" color="default" closeDelay={0}>
        <button
          className={`rounded-lg p-2 transition-all hover:bg-slate-200 ${
            isOpen || editor.isActive("embed")
              ? "bg-slate-200"
              : "bg-transparent"
          }}`}
          onClick={onOpen}
        >
          <EmbedIcon />
        </button>
      </Tooltip>
      <Modal
        isOpen={isOpen}
        isDismissable={true}
        backdrop="opaque"
        onClose={onClose}
      >
        <ModalContent className={`flex flex-col gap-3 p-5`}>
          <h3 className="text-center text-2xl font-light lowercase">
            Embed a code snippet!
          </h3>
          <form
            className={`flex flex-col items-center gap-3`}
            onSubmit={(e) => {
              e.preventDefault();

              if (!embed) {
                toast.error("no embed content entered!");
                return;
              }

              editor.commands.insertContent(embed);
              onClose();
              setEmbed("");
            }}
          >
            <textarea
              placeholder="paste your embed code here..."
              value={embed}
              onChange={(e) => setEmbed(e.target.value)}
              className="w-full rounded-lg bg-[#f7f7f7] p-2 px-3 outline-none transition-all focus:bg-[#eee]"
            ></textarea>
            <input
              type="submit"
              className="max-w-[100px] rounded-lg bg-[#fafafa] p-2 px-3"
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
      <Tooltip placement="left" content="Link" color="default" closeDelay={0}>
        <button
          className={`rounded-lg p-2 transition-all hover:bg-slate-200 ${
            showLinkAdd || editor.isActive("link") ? "bg-slate-200" : "bg-white"
          }}`}
          onClick={() => setShowLinkAdd((prev) => !prev)}
        >
          <LinkIcon />
        </button>
      </Tooltip>
      <Tooltip placement="left" content="Unlink" color="default" closeDelay={0}>
        <button
          className={`rounded-lg p-2 transition-all hover:bg-slate-200 ${
            showLinkAdd || editor.isActive("link") ? "bg-slate-200" : "bg-white"
          }}`}
          onClick={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
        >
          <UnlinkIcon />
        </button>
      </Tooltip>
      <form
        ref={clickAwayRef}
        className={`absolute ${
          showLinkAdd ? "z-30 h-auto w-auto opacity-100" : "z-[-10] opacity-0"
        } flex translate-x-10 flex-row items-center gap-2 overflow-hidden rounded-md bg-white shadow-xl transition-all`}
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
          className="p-2 px-3 outline-none transition-all focus:bg-[#eee]"
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
      className={`flex flex-col items-center justify-start ${
        bottomBorder ? "border-t" : ""
      } gap-1 px-2 py-2`}
    >
      {children}
    </div>
  );
};
