"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Event_PHOTO_X_PXL, Event_PHOTO_Y_PXL, Spinner } from "@/app/utils";
import { CreateEvent } from "@/app/api/backend/events";
import { endpoints } from "@/app/api/backend/endpoints";
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
  H1Icon,
  H2Icon,
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

export default function CreateEvent() {
  const router = useRouter();
  const session = useSession();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "prose max-w-none outline-none border-2 px-4 py-3 rounded-xl",
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

  useEffect(() => {
    setLoading(false);
  }, []);

  if (session.status == "loading") return <></>;
  if (session.status === "unauthenticated" || !session.data?.user) {
    router.push("/");
    return <></>;
  }

  async function handleConfirm() {
    if (!session.data || !session.data.user) {
      toast.error("Unauthorised");
      return router.push("/");
    }

    if (!isValidURL(link)) {
      return toast.error("Please enter a valid link");
    }

    if (title === "" || description == "" || location == "") {
      return toast.error("Please fill all fields");
    }

    if (!photo) {
      return toast.error("Please upload a photo!");
    }

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (start.isAfter(end)) {
      return toast.error("The start date cannot occur after the end date!");
    }

    const event: CreateEvent = {
      creator: session.data.user.id,
      title: title,
      description: description,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      location: location,
      link: link,
      public: false,
    };

    setLoading(true);
    endpoints.events
      .create(event, photo)
      .then((uploadedEvent) => {
        setLoading(false);
        toast.success("Created event successfully");
        router.push("/events");
        return;
      })
      .catch((e) => {
        toast.error(`Failed to create event: ${e}`);
        setLoading(false);
        return;
      });
  }

  async function handleCancel() {
    return router.back();
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
      {loading && <Spinner />}
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
            onChange={(date: Date) => setStartDate(date)}
          />

          <p className="py-5  text-2xl font-semibold">End Time</p>
          <DatePicker
            className="bg-red"
            showIcon={true}
            showTimeSelect
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
          />

          <p className="py-5  text-2xl font-semibold">Upload photo</p>
          <PhotoUploader
            uploadCroppedPhoto={(blob: Blob) => {
              setLoading(true);
              setPhoto(blob);
              setLoading(false);
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
            onClick={handleCancel}
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
      <button
        className={`p-2 ${
          editor.isActive("heading", {
            level: 3,
          })
            ? "bg-slate-300"
            : "bg-transparent"
        } rounded-lg transition-all hover:bg-slate-200`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <H3Icon />
      </button>
      <button
        className={`p-2 ${
          editor.isActive("bold") ? "bg-slate-300" : "bg-transparent"
        } rounded-lg transition-all hover:bg-slate-200`}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon />
      </button>
      <button
        className={`p-2 ${
          editor.isActive("italic") ? "bg-slate-300" : "bg-transparent"
        } rounded-lg transition-all hover:bg-slate-200`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon />
      </button>
      <button
        className={`p-2 ${
          editor.isActive("underline") ? "bg-slate-300" : "bg-transparent"
        } rounded-lg transition-all hover:bg-slate-200`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon />
      </button>
      <button
        className={`p-2 ${
          editor.isActive("strike") ? "bg-slate-300" : "bg-transparent"
        } rounded-lg transition-all hover:bg-slate-200`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikeIcon />
      </button>
      <button
        className={`p-2 ${
          editor.isActive("code") ? "bg-slate-300" : "bg-transparent"
        } rounded-lg transition-all hover:bg-slate-200`}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <CodeIcon />
      </button>
      <button
        className={`p-2 ${
          editor.isActive("blockquote") ? "bg-slate-300" : "bg-transparent"
        } rounded-lg transition-all hover:bg-slate-200`}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <QuoteIcon />
      </button>
      <button
        className={`p-2 ${
          editor.isActive("bulletList") ? "bg-slate-300" : "bg-transparent"
        } rounded-lg transition-all hover:bg-slate-200`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ULIcon />
      </button>
      <button
        className={`p-2 ${
          editor.isActive("orderedList") ? "bg-slate-300" : "bg-transparent"
        } rounded-lg transition-all hover:bg-slate-200`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <OLIcon />
      </button>
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
      <button
        className={`rounded-lg p-2 transition-all hover:bg-slate-200 ${
          showLinkAdd || editor.isActive("link") ? "bg-slate-200" : "bg-white"
        }}`}
        onClick={() => setShowLinkAdd((prev) => !prev)}
      >
        <LinkIcon />
      </button>
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
