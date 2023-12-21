"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { useEffect, useState } from "react";

import { api } from "@/trpc/react";

import PhotoUploader from "@/app/photoUploader";
import { Spinner, isModerator } from "@/app/utils";
import { COMPANY_PHOTO_X_PXL, COMPANY_PHOTO_Y_PXL } from "@/app/utils";
import { getCompanyImageKey, upload } from "@/app/utils/s3";

import { toast } from "react-hot-toast";

const TOAST_UPLOADING_PHOTO_ID = "uploading-photo";

export default function CreateCompanyRoot() {
  const router = useRouter();
  const session = useSession();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [photo, setPhoto] = useState<Blob | null>(null);

  const { mutate: createCompany, isLoading: creatingCompany } =
    api.companies.create.useMutation({
      onSuccess: async ({ id, logoId }) => {
        if (photo && logoId) {
          toast.loading("Uploading photo...", { id: TOAST_UPLOADING_PHOTO_ID });

          const res = await upload(photo, getCompanyImageKey(id, logoId));
          if (!res.ok) {
            toast.dismiss(TOAST_UPLOADING_PHOTO_ID);
            return toast.error("Failed to upload photo");
          }

          toast.dismiss(TOAST_UPLOADING_PHOTO_ID);
        }
        toast.success("Created company successfully");
        router.push("/companies");
      },
      onError: (error) => {
        toast.error(`Failed to create company: ${error.message}`);
      },
    });

  useEffect(() => {
    router.prefetch("/auth/login");
  }, [router]);

  if (session.status == "loading") return <></>;
  if (!isModerator(session.data)) {
    router.push("/auth/login");
  }

  async function handleConfirm() {
    if (!isValidURL(websiteUrl)) {
      return toast.error("Please enter a valid website URL");
    }

    if (!photo) {
      return toast.error("Please upload a photo!");
    }

    createCompany({
      name,
      websiteUrl,
      description,
      logo: !!photo,
    });
  }

  function isValidURL(text: string) {
    let url: URL;

    try {
      url = new URL(text);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  return (
    <>
      {creatingCompany && <Spinner />}
      {
        <div className="container m-auto flex flex-col">
          <p className="py-5  text-2xl font-semibold">Name</p>
          <input
            className="rounded-xl border-2 px-4 py-3 transition-all"
            type="text"
            placeholder="Company Name..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <p className="py-5  text-2xl font-semibold">Description</p>
          <input
            className="rounded-xl border-2 px-4 py-3 transition-all"
            type="text"
            placeholder="A short vision statement..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <p className="py-5  text-2xl font-semibold">Website URL</p>
          <input
            className="rounded-xl border-2 px-4 py-3 transition-all"
            type="text"
            placeholder="Home page of the company..."
            value={websiteUrl}
            onChange={(e) => {
              setWebsiteUrl(e.target.value);
            }}
          />

          <p className="py-5  text-2xl font-semibold">Upload photo</p>
          <PhotoUploader
            uploadCroppedPhoto={(blob: Blob) => {
              setPhoto(blob);
            }}
            cancelUploadingCroppedPhoto={() => {
              setPhoto(null);
            }}
            xPixels={COMPANY_PHOTO_X_PXL}
            yPixels={COMPANY_PHOTO_Y_PXL}
          />

          <button
            className="mr-2 mt-10 rounded-xl border-2 bg-[#f0f0f0] px-4 py-2 transition-all hover:border-blue-300 hover:bg-[#ddd]"
            onClick={handleConfirm}
          >
            Add company
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
