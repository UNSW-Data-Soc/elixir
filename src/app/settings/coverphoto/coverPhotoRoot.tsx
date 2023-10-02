"use client";

import { endpoints } from "@/app/api/backend/endpoints";
import PhotoUploader from "@/app/photoUploader";
import { COVER_PHOTO_X_PXL, COVER_PHOTO_Y_PXL, Spinner } from "@/app/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CoverPhotoRoot() {
    const router = useRouter();
    const session = useSession();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session.status === "unauthenticated" || !session.data?.user.admin) {
            router.push("/");
        }
    });

    async function uploadCroppedPhoto(blob: Blob) {
        setLoading(true);
        let uploaded_photo = await endpoints.file.uploadCoverPhoto(blob);

        if (!uploaded_photo) {
            toast.error("Failed to upload photo.");
            setLoading(false);
            return;
        }

        setLoading(false);
        toast.success("Photo uploaded successfully");
    }

    async function cancelUploadingCroppedPhoto() {}

    return (
        <div>
            {loading && <Spinner />}
            <PhotoUploader
                uploadCroppedPhoto={uploadCroppedPhoto}
                cancelUploadingCroppedPhoto={cancelUploadingCroppedPhoto}
                xPixels={COVER_PHOTO_X_PXL}
                yPixels={COVER_PHOTO_Y_PXL}
            />
        </div>
    );
}
