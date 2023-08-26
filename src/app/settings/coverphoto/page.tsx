"use client";

import { endpoints } from "@/app/api/backend/endpoints";
import PhotoCropper, { Crop, getBlob } from "@/app/profile/[id]/photoCropper";
import { FileUploadDropzone, IMAGE_FILE_TYPES, Spinner } from "@/app/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const COVER_PHOTO_X_PXL = 6000;
export const COVER_PHOTO_Y_PXL = 4000;

export default function CoverPhoto() {
    const router = useRouter();
    const session = useSession();

    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<Blob>();

    const [showCropper, setShowCropper] = useState(false);
    const [photoInCropper, setPhotoInCropper] = useState("");

    if (session.status === "unauthenticated" || !session.data?.user.admin)
        return router.push("/");

    async function uploadCroppedPhoto(crop: Crop) {
        setLoading(true);
        const croppedBlob = await getBlob(
            photoInCropper,
            crop,
            COVER_PHOTO_X_PXL,
            COVER_PHOTO_Y_PXL
        );
        let uploaded_photo = await endpoints.file.uploadCoverPhoto(croppedBlob);

        if (!uploaded_photo) {
            toast.error("Failed to upload photo.");
            setLoading(false);
            return;
        }

        setShowCropper(false);
        window.URL.revokeObjectURL(photoInCropper);
        setPhotoInCropper("");

        setLoading(false);
        toast.success("Photo uploaded successfully");
    }

    async function cancelUploadingCroppedPhoto() {
        setShowCropper(false);
        window.URL.revokeObjectURL(photoInCropper);
        setPhotoInCropper("");
    }

    async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        let files = event.target.files;
        setLoading(true);
        if (files && IMAGE_FILE_TYPES.includes(files[0].type)) {
            let blob = files[0];
            const blobURL = URL.createObjectURL(blob);
            setPhotoInCropper(blobURL);
            setLoading(false);

            setShowCropper(true);
        } else {
            toast.error("Please upload a valid file!");
        }

        setLoading(false);
    }

    return (
        <div className="flex flex-col gap-3 h-screen justify-center items-center">
            <h1 className="py-5 text-2xl font-semibold"> Upload Cover Photo</h1>
            <p className="italic">This will replace the image on the home page</p>
            <div className="w-60">
                {loading && <Spinner />}
                <FileUploadDropzone handleFileChange={handleFileChange} />
                {showCropper && (
                    <PhotoCropper
                        uploadCroppedPhoto={uploadCroppedPhoto}
                        cancelUploadingCroppedPhoto={
                            cancelUploadingCroppedPhoto
                        }
                        photo={photoInCropper}
                        aspect={1.5}
                        xPixels={COVER_PHOTO_X_PXL}
                        yPixels={COVER_PHOTO_Y_PXL}
                    />
                )}
            </div>
        </div>
    );
}
