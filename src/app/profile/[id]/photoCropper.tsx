import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { toast } from "react-hot-toast";

export interface Crop {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default function PhotoCropper(props: {
    photo: string,
    xPixels: number,
    yPixels: number,
    aspect: number,
    uploadCroppedPhoto: (pixelCrop: Crop) => void,
    cancelUploadingCroppedPhoto: () => void,
}) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [pixelCrop, setPixelCrop] = useState<Crop>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const handleCropComplete = useCallback(
        (croppedArea: Crop, croppedAreaPixels: Crop) => {
            setPixelCrop(croppedAreaPixels);
        },
        []
    );

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="flex flex-col justify-items-center justify-center items-center">
                <div className="relative w-[750px] h-[750px] flex flex-col justify-items-center justify-center items-center">
                    <Cropper
                        style={{
                            containerStyle: {
                                cursor: "pointer",
                            },
                        }}
                        image={props.photo}
                        crop={crop}
                        zoom={zoom}
                        aspect={props.aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={handleCropComplete}
                        cropShape="rect"
                        zoomSpeed={0.05}
                    />
                </div>
                <div>
                    <button
                        className="py-2 px-4 mr-2 bg-[#f0f0f0] mt-10 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
                        onClick={() => props.uploadCroppedPhoto(pixelCrop)}
                    >
                        Upload
                    </button>
                    <button
                        className="py-2 px-4 mr-2 bg-[#f0f0f0] mt-10 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
                        onClick={() => props.cancelUploadingCroppedPhoto()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

async function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
        image.src = url;
    });
}

async function getCroppedImg(
    imageSrc: string,
    pixelCrop: Crop,
    xPixels: number,
    yPixels: number
) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        toast.error("Failed to crop photo");
        return;
    }

    canvas.width = xPixels;
    canvas.height = yPixels;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return canvas;
}

// revoking the URL appropriately remains the responsibility of the caller
export async function getBlob(
    imageSrc: string,
    crop: Crop,
    xPixels: number,
    yPixels: number
): Promise<Blob> {
    return new Promise(async (resolve) => {
        const canvas = await getCroppedImg(imageSrc, crop, xPixels, yPixels);
        if (!canvas) {
            toast.error("Failed to crop photo");
            return;
        }

        await canvas.toBlob((file) => {
            if (!file) {
                toast.error("Failed to crop photo");
                return;
            }

            resolve(file);
        }, "image/png");
    });
}
