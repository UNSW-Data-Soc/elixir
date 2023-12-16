"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Spinner } from "@/app/utils";
import { CreateCompany } from "@/app/api/backend/companies";
import { endpoints } from "@/app/api/backend/endpoints";
import PhotoUploader from "@/app/photoUploader";
import { COMPANY_PHOTO_X_PXL, COMPANY_PHOTO_Y_PXL } from "@/app/utils";

export default function CreateCompanyRoot() {
  const router = useRouter();
  const session = useSession();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
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
    if (!isValidURL(websiteURL)) {
      return toast.error("Please enter a valid website URL");
    }

    if (!photo) {
      return toast.error("Please upload a photo!");
    }

    let company: CreateCompany = {
      name: name,
      website_url: websiteURL,
      description: description,
    };

    setLoading(true);
    endpoints.companies
      .create(company, photo)
      .then((uploadedCompany) => {
        setLoading(false);
        toast.success("Created company successfully");
        router.push("/companies");
        return;
      })
      .catch(() => {
        toast.error("Failed to create company");
        setLoading(false);
        return;
      });
  }

  async function handleCancel() {
    return router.back();
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
      {loading && <Spinner />}
      {
        <div className="container m-auto flex flex-col">
          <div className="container m-auto flex flex-row flex-wrap justify-between">
            <div>
              <h1 className="py-3 text-5xl font-semibold">New Company</h1>
              <div></div>
            </div>
          </div>
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
            value={websiteURL}
            onChange={(e) => {
              setWebsiteURL(e.target.value);
            }}
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
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      }
    </>
  );
}
