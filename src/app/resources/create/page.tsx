"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FileUploadDropzone,
  Spinner,
  IMAGE_FILE_TYPES,
  RESOURCE_FILE_TYPES,
  MAX_ALLOWABLE_RESOURCE_FILE_SIZE,
  isModerator,
} from "@/app/utils";
import { Tooltip } from "@nextui-org/tooltip";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { api } from "@/trpc/react";
import { getResourceFileKey, upload } from "@/app/utils/s3";

// TODO: move to utils file
function isValidURL(text: string) {
  let url: URL;

  try {
    url = new URL(text);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export default function CreateResource() {
  const router = useRouter();
  const session = useSession();

  const ctx = api.useUtils();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisibility] = useState(true);
  const [resourceTypeFile, setResourceTypeFile] = useState(true);
  const [link, setLink] = useState("");
  const [file, setFile] = useState<Blob | null>(null);

  const { mutate: createResource, isLoading } =
    api.resources.create.useMutation({
      onSuccess: async ({ id, link: fileId }) => {
        if (resourceTypeFile && file) {
          const res = await upload(file, getResourceFileKey(id, fileId));
          if (!res.ok) {
            toast.error("Failed to upload resource file");
            return;

            // TODO: delete resource?
          }
        }
        void ctx.resources.invalidate();
        toast.success("Created resource successfully");
        router.push("/resources");
      },

      onError: (err) => {
        toast.error(`Failed to create resource: ${err.message}`);
      },
    });

  if (session.status == "loading") return <></>;
  if (!isModerator(session.data)) {
    router.push("/auth/login");
    return <></>;
  }

  async function handleConfirm() {
    if (!resourceTypeFile && !isValidURL(link)) {
      return toast.error("Invalid link!");
    } else if (resourceTypeFile && !file) {
      return toast.error("Please upload a file!");
    } else if (title === "" || description === "") {
      return toast.error("Please ensure all fields are non-empty!");
    }

    createResource({
      title,
      description,
      link: resourceTypeFile ? undefined : link,
      resourcePublic: visible,
    });
  }

  async function handleCancel() {
    return router.back();
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (
      files &&
      (IMAGE_FILE_TYPES.includes(files[0].type) ||
        RESOURCE_FILE_TYPES.includes(files[0].type))
    ) {
      const blob = files[0];
      setFile(blob);
    } else {
      toast.error("Please upload a valid file!");
    }
  }

  return (
    <>
      {isLoading && <Spinner />}
      {
        <div className="container m-auto flex flex-col">
          <div className="container m-auto flex flex-row flex-wrap justify-between">
            <div>
              <h1 className="py-3 text-5xl font-semibold">New Resource</h1>
            </div>
          </div>
          <p className="py-5  text-2xl font-semibold">Title</p>
          <input
            className="rounded-xl border-2 px-4 py-3 transition-all"
            type="text"
            placeholder="Your title..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <p className="py-5  text-2xl font-semibold">Description</p>
          <input
            className="rounded-xl border-2 px-4 py-3 transition-all"
            type="text"
            placeholder="Your description..."
            value={description}
            disabled={isLoading}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />

          <div className="mb-8 mr-8 mt-8 flex items-center gap-5">
            <p className="py-5  text-2xl font-semibold">Link resource</p>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={resourceTypeFile}
                disabled={isLoading}
                onChange={(e) => {
                  setResourceTypeFile(!resourceTypeFile);
                }}
              />
              <div className="peer h-7 w-14 rounded-full bg-gray-200 after:absolute after:left-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            </label>
            <p className="py-5  text-2xl font-semibold">Upload file</p>
            <Tooltip
              content={
                "Link an existing resource OR upload an image, pdf, csv or plain text file"
              }
            >
              <QuestionMarkCircleIcon className="flex w-5 items-center justify-center align-baseline" />
            </Tooltip>
          </div>

          {resourceTypeFile && file === null && (
            <FileUploadDropzone
              handleFileChange={handleFileChange}
              allowLargerFileSize={MAX_ALLOWABLE_RESOURCE_FILE_SIZE}
            />
          )}
          {resourceTypeFile && file !== null && (
            <div className="item-center m-3 flex justify-center p-3 align-baseline outline outline-2">
              <p>{file?.name}</p>
            </div>
          )}

          {!resourceTypeFile && (
            <input
              className="rounded-xl border-2 px-4 py-3 transition-all"
              type="text"
              placeholder="Add a link.."
              value={link}
              disabled={isLoading}
              onChange={(e) => {
                setLink(e.target.value);
              }}
            />
          )}

          <div className="mb-8 mr-8 mt-8 flex items-center gap-5">
            <p className="py-5  text-2xl font-semibold">Draft</p>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={visible}
                disabled={isLoading}
                onChange={(e) => {
                  setVisibility(!visible);
                }}
              />
              <div className="peer h-7 w-14 rounded-full bg-gray-200 after:absolute after:left-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            </label>
            <p className="py-5  text-2xl font-semibold">Publish</p>
          </div>

          <button
            className="mr-2 mt-10 rounded-xl border-2 bg-[#f0f0f0] px-4 py-2 transition-all hover:border-blue-300 hover:bg-[#ddd]"
            onClick={handleConfirm}
          >
            Add resource
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
