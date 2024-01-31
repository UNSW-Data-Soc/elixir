"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  DEFAULT_DATEPICKER_INTERVAL,
  Event_PHOTO_X_PXL,
  Event_PHOTO_Y_PXL,
  Spinner,
  isModerator,
} from "@/app/utils";
import { CreateEvent } from "@/app/api/backend/events";
import PhotoUploader from "@/app/photoUploader";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { TIPTAP_EXTENSIONS } from "@/app/blogs/tiptapExtensions";
import { BubbleMenu } from "@tiptap/react";
import {
  BoldIcon,
  CodeIcon,
  H3Icon,
  ItalicIcon,
  LinkIcon,
  OLIcon,
  QuoteIcon,
  StrikeIcon,
  ULIcon,
  UnderlineIcon,
  UnlinkIcon,
} from "@/app/blogs/editor/icons";
import useClickAway from "@/app/hooks/useClickAway";
import { Tooltip } from "@nextui-org/react";
import { api } from "@/trpc/react";
import { getEventImageKey, upload } from "@/app/utils/s3";

const TOAST_ID_UPLOADING_PHOTO = "uploading-photo";

export default function CreateEvent() {
  const router = useRouter();
  const session = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "prose max-w-none outline-none border-2 px-4 py-3 rounded-xl min-h-[300px]",
      },
    },
    extensions: TIPTAP_EXTENSIONS,
    content:
      "Description of event... (highlight text to see rich-text options)",
    autofocus: false,
    onBlur: ({ editor }) => setDescription(JSON.stringify(editor.getJSON())),
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [photo, setPhoto] = useState<Blob | null>(null);

  const { mutate: deleteEvent } = api.events.delete.useMutation({});

  const { mutate: createEvent } = api.events.create.useMutation({
    onSuccess: async ({ id: eventId, photoId }) => {
      if (photo && photoId) {
        toast.loading("Uploading photo...", { id: TOAST_ID_UPLOADING_PHOTO });

        const res = await upload(photo, getEventImageKey(eventId, photoId));

        toast.dismiss(TOAST_ID_UPLOADING_PHOTO);

        if (!res.ok) {
          toast.error("Failed to upload photo");
          deleteEvent({ id: eventId }); // TODO: should we delete if photo upload fails?
          return;
        }
      }
      toast.success("Created event successfully");
      router.push("/events");
    },
    onError: (err) => {
      toast.error(`Failed to create event: ${err.message}`);
    },
  });

  if (session.status == "loading") return <></>;
  if (session.status === "unauthenticated" || !isModerator(session.data)) {
    router.push("/");
    return <></>;
  }

  async function handleConfirm() {
    if (!isValidURL(link)) {
      return toast.error("Please enter a valid link");
    }

    if (title === "" || description == "" || location == "") {
      return toast.error("Please fill all fields");
    }

    // TODO: should we force a photo upload?
    // if (!photo) {
    //   return toast.error("Please upload a photo!");
    // }

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (start.isAfter(end)) {
      return toast.error("The start date cannot occur after the end date!");
    }

    createEvent({
      title,
      description,
      startTime: startDate,
      endTime: endDate,
      location,
      link,
      photoFileType: photo?.type,
    });
  }

  function isValidURL(text: string) {
    try {
      const url = new URL(text);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  return (
    <>
      {
        <div className="container m-auto flex flex-col">
          <div className="container m-auto flex flex-row flex-wrap justify-between">
            <div>
              <h1 className="py-3 text-5xl font-semibold">New Event</h1>
              <div></div>
            </div>
          </div>
          <p className="py-5  text-2xl font-semibold">Title</p>
          <input
            className="rounded-xl border-2 px-4 py-3 transition-all"
            type="text"
            placeholder="Event Name..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <p className="py-5  text-2xl font-semibold">Description</p>
          <EditorContent editor={editor} />
          {!!editor && <EditorBubbleMenu editor={editor} />}

          <p className="py-5  text-2xl font-semibold">Link </p>
          <input
            className="rounded-xl border-2 px-4 py-3 transition-all"
            type="text"
            placeholder="Link to event..."
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
            }}
          />

          <p className="py-5  text-2xl font-semibold">Location</p>
          <input
            className="rounded-xl border-2 px-4 py-3 transition-all"
            type="text"
            placeholder="Place where the event will occur..."
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          />

          <p className="py-5  text-2xl font-semibold">Start Time</p>
          <DatePicker
            className="bg-red"
            showIcon={true}
            showTimeSelect
            selected={startDate}
            timeIntervals={DEFAULT_DATEPICKER_INTERVAL}
            onChange={(date: Date) => setStartDate(date)}
          />

          <p className="py-5  text-2xl font-semibold">End Time</p>
          <DatePicker
            className="bg-red"
            showIcon={true}
            showTimeSelect
            selected={endDate}
            timeIntervals={DEFAULT_DATEPICKER_INTERVAL}
            onChange={(date: Date) => setEndDate(date)}
          />

          <p className="py-5  text-2xl font-semibold">Upload photo</p>
          <PhotoUploader
            uploadCroppedPhoto={(blob: Blob) => {
              setPhoto(blob);
            }}
            cancelUploadingCroppedPhoto={() => {
              setPhoto(null);
            }}
            xPixels={Event_PHOTO_X_PXL}
            yPixels={Event_PHOTO_Y_PXL}
          />

          <button
            className="mr-2 mt-10 rounded-xl border-2 bg-[#f0f0f0] px-4 py-2 transition-all hover:border-blue-300 hover:bg-[#ddd]"
            onClick={handleConfirm}
          >
            Add event
          </button>
          <button
            className="mr-2 mt-10 rounded-xl border-2 bg-[#f0f0f0] px-4 py-2 transition-all hover:border-blue-300 hover:bg-[#ddd]"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      }
    </>
  );
}

const EditorBubbleMenu = ({ editor }: { editor: Editor }) => {
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100, maxWidth: "none" }}
      className="flex rounded-lg bg-[#f6f6f6] shadow-xl"
    >
      <Tooltip placement="top" content="Heading" color="default" closeDelay={0}>
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
      <Tooltip placement="top" content="Bold" color="default" closeDelay={0}>
        <button
          className={`p-2 ${
            editor.isActive("bold") ? "bg-slate-300" : "bg-transparent"
          } rounded-lg transition-all hover:bg-slate-200`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon />
        </button>
      </Tooltip>
      <Tooltip placement="top" content="Italic" color="default" closeDelay={0}>
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
        placement="top"
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
        placement="top"
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
      <Tooltip placement="top" content="Code" color="default" closeDelay={0}>
        <button
          className={`p-2 ${
            editor.isActive("code") ? "bg-slate-300" : "bg-transparent"
          } rounded-lg transition-all hover:bg-slate-200`}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <CodeIcon />
        </button>
      </Tooltip>
      <Tooltip placement="top" content="Quote" color="default" closeDelay={0}>
        <button
          className={`p-2 ${
            editor.isActive("blockquote") ? "bg-slate-300" : "bg-transparent"
          } rounded-lg transition-all hover:bg-slate-200`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <QuoteIcon />
        </button>
      </Tooltip>
      <Tooltip placement="top" content="List" color="default" closeDelay={0}>
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
        placement="top"
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
      <EditorAddLink editor={editor} />
    </BubbleMenu>
  );
};

const EditorAddLink = ({ editor }: { editor: Editor }) => {
  const [showLinkAdd, setShowLinkAdd] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");
  const clickAwayRef = useClickAway(() => setShowLinkAdd(false));
  if (!editor) return <></>;

  return (
    <>
      <Tooltip placement="top" content="Link" color="default" closeDelay={0}>
        <button
          className={`rounded-lg p-2 transition-all hover:bg-slate-200 ${
            showLinkAdd || editor.isActive("link") ? "bg-slate-200" : "bg-white"
          }}`}
          onClick={() => setShowLinkAdd((prev) => !prev)}
        >
          <LinkIcon />
        </button>
      </Tooltip>
      <Tooltip
        placement="top"
        content="Remove link"
        color="default"
        closeDelay={0}
      >
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
