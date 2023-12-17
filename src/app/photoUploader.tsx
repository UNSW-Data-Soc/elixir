import { ChangeEvent, useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { FileUploadDropzone, IMAGE_FILE_TYPES } from "@/app/utils";
import { toast } from "react-hot-toast";

export interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ZOOM_SPEED = 0.25;

export default function PhotoUploader(props: {
  xPixels: number;
  yPixels: number;
  uploadCroppedPhoto: (blob: Blob) => void;
  cancelUploadingCroppedPhoto: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [uploadedFilename, setUploadedFilename] = useState("");
  const [photoInCropper, setPhotoInCropper] = useState("");
  const [showCropper, setShowCropper] = useState(false);
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
    [],
  );

  return (
    <>
      {photoInCropper === "" ? (
        <FileUploadDropzone
          handleFileChange={(event) => {
            let files = event.target.files;
            if (files && IMAGE_FILE_TYPES.includes(files[0].type)) {
              let file = files[0];

              // Check the image dimensions before setting it for cropping
              const image = new Image();
              image.src = URL.createObjectURL(file);

              image.onload = () => {
                if (
                  image.width >= props.xPixels &&
                  image.height >= props.yPixels
                ) {
                  setUploadedFilename(file.name);
                  setPhotoInCropper(image.src);
                  setShowCropper(true);
                } else {
                  return toast.error(
                    `Image dimensions must be at least ${props.xPixels}x${props.yPixels} pixels`,
                  );
                }
              };

              image.onerror = () => {
                return toast.error("Failed to load the image.");
              };
            } else {
              toast.error("Please upload a valid file!");
              throw new Error("");
            }
          }}
        />
      ) : (
        <div className="item-center m-3 flex justify-center p-3 align-baseline outline outline-2">
          <p>{uploadedFilename}</p>
        </div>
      )}

      {showCropper && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center justify-center justify-items-center">
            <p>
              {props.xPixels}x{props.yPixels}
            </p>
            <div className="relative flex h-[750px] w-[750px] flex-col items-center justify-center justify-items-center">
              <Cropper
                style={{
                  containerStyle: {
                    cursor: "pointer",
                  },
                }}
                image={photoInCropper}
                crop={crop}
                zoom={zoom}
                aspect={props.xPixels / props.yPixels}
                onCropChange={setCrop}
                onZoomChange={(newZoom: number) => {
                  const newWidth = pixelCrop.width * newZoom;
                  const newHeight = pixelCrop.height * newZoom;

                  const minZoom = Math.min(
                    props.xPixels / pixelCrop.width,
                    props.yPixels / pixelCrop.height,
                  );
                  const maxZoom = Math.max(
                    newWidth / props.xPixels,
                    newHeight / props.yPixels,
                  );
                  const limitedZoom = Math.max(
                    minZoom,
                    Math.min(maxZoom, newZoom),
                  );

                  setZoom(limitedZoom);
                }}
                onCropComplete={handleCropComplete}
                cropShape="rect"
                zoomSpeed={ZOOM_SPEED}
              />
            </div>
            <div>
              <button
                className="mr-2 mt-10 rounded-xl border-2 bg-[#f0f0f0] px-4 py-2 transition-all hover:border-blue-300 hover:bg-[#ddd]"
                onClick={async () => {
                  let blob = await getBlob(
                    photoInCropper,
                    pixelCrop,
                    props.xPixels,
                    props.yPixels,
                  );
                  props.uploadCroppedPhoto(blob);
                  window.URL.revokeObjectURL(photoInCropper);
                  setShowCropper(false);
                }}
              >
                Upload
              </button>
              <button
                className="mr-2 mt-10 rounded-xl border-2 bg-[#f0f0f0] px-4 py-2 transition-all hover:border-blue-300 hover:bg-[#ddd]"
                onClick={() => {
                  window.URL.revokeObjectURL(photoInCropper);
                  props.cancelUploadingCroppedPhoto();
                  setPhotoInCropper("");
                  setShowCropper(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
  yPixels: number,
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
    canvas.height,
  );

  return canvas;
}

// revoking the URL appropriately remains the responsibility of the caller
async function getBlob(
  imageSrc: string,
  crop: Crop,
  xPixels: number,
  yPixels: number,
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
