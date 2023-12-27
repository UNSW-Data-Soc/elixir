"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { useState } from "react";

import { api } from "@/trpc/react";

import PhotoUploader from "@/app/photoUploader";
import {
  COVER_PHOTO_X_PXL,
  COVER_PHOTO_Y_PXL,
  Spinner,
  isModerator,
} from "@/app/utils";
import { getCoverPhotoKey, upload } from "@/app/utils/s3";

import toast from "react-hot-toast";

export default function CoverPhotoRoot() {
  const router = useRouter();
  const session = useSession();

  const [photo, setPhoto] = useState<Blob | null>(null);

  const { mutate: uploadCoverPhoto, isLoading } =
    api.coverPhotos.upload.useMutation({
      onSuccess: async ({ id }) => {
        if (!photo) {
          toast.error("Please upload a photo.");
          return;
        }

        const res = await upload(photo, getCoverPhotoKey(id));

        if (!res.ok) {
          toast.error("Failed to upload photo.");
          return;
        }

        toast.success("Cover photo uploaded successfully");
      },
      onError: (e) => {
        toast.error(e.message);
      },
    });

  if (session.status === "loading") return <Spinner />;
  if (!isModerator(session.data)) {
    router.push("/");
  }

  async function uploadCroppedPhoto(blob: Blob) {
    setPhoto(blob);

    uploadCoverPhoto();
  }

  async function cancelUploadingCroppedPhoto() {
    // TODO: cancel uploading photo
  }

  return (
    <div className="min-w-[270px] sm:min-w-[500px]">
      {isLoading && <Spinner />}
      <PhotoUploader
        uploadCroppedPhoto={uploadCroppedPhoto}
        cancelUploadingCroppedPhoto={cancelUploadingCroppedPhoto}
        xPixels={COVER_PHOTO_X_PXL}
        yPixels={COVER_PHOTO_Y_PXL}
      />
    </div>
  );
}
