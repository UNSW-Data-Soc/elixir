"use client";

import { endpoints } from "@/app/api/backend/endpoints";
import FileUploader from "@/app/photoUploader";
import { COVER_PHOTO_X_PXL, COVER_PHOTO_Y_PXL, Spinner } from "@/app/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CoverPhoto() {
    const router = useRouter();
    const session = useSession();

    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<Blob>();

    if (session.status === "unauthenticated" || !session.data?.user.admin)
        return router.push("/");

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

    async function cancelUploadingCroppedPhoto() {
    }

    return (
        <div className="flex flex-col gap-3 h-screen justify-center items-center">
            <h1 className="py-5 text-2xl font-semibold"> Upload Cover Photo</h1>
            <p className="italic">This will replace the image on the home page</p>
            <div>
                {loading && <Spinner />}
                <FileUploader
                    uploadCroppedPhoto={uploadCroppedPhoto}
                    cancelUploadingCroppedPhoto={
                        cancelUploadingCroppedPhoto
                    }
                    xPixels={COVER_PHOTO_X_PXL}
                    yPixels={COVER_PHOTO_Y_PXL}
                />
            </div>
        </div>
    );
}
