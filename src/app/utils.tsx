import { ChangeEvent } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export const ALL_IMAGE_FILE_TYPES_STR =
    "image/png, image/jpg, image/gif, image/jpeg, image/webp, application/pdf, text/csv, text/plain";
export const IMAGE_FILE_TYPES = [
    "image/png",
    "image/jpg",
    "image/gif",
    "image/jpeg",
    "image/webp",
];
export const RESOURCE_FILE_TYPES = [
    "application/pdf",
    "text/csv",
    "text/plain",
];

export const MAX_ALLOWABLE_IMAGE_FILE_SIZE = 3e6; // 3MB
export const MAX_ALLOWABLE_RESOURCE_FILE_SIZE = 10e6; // 10MB

export const ZERO_WIDTH_SPACE = <span> &#8203; </span>;

export const COVER_PHOTO_X_PXL = 1920;
export const COVER_PHOTO_Y_PXL = 1080;
export const PROFILE_PIC_X_PXL = 500;
export const PROFILE_PIC_Y_PXL = 500;
export const COMPANY_PHOTO_X_PXL = 500;
export const COMPANY_PHOTO_Y_PXL = 500;
export const JOB_PHOTO_X_PXL = 500;
export const JOB_PHOTO_Y_PXL = 500;
export const Event_PHOTO_X_PXL = 1000;
export const Event_PHOTO_Y_PXL = 500;

export const FYG_2021_LINK = "https://drive.google.com/file/d/1Fdf56Csia7Ea3HNPSttzRIb5Cfg6z7H5/preview";
export const FYG_2022_LINK = "https://drive.google.com/file/d/1tfqWGa1CUkUhNagho0dYeYMGXQscnke0/preview";
export const FYG_2023_LINK = "https://drive.google.com/file/d/1Fdf56Csia7Ea3HNPSttzRIb5Cfg6z7H5/preview";

export const CAREERS_GUIDE = "https://drive.google.com/file/d/1-y2Uv3YahnbM9O8Xp1knhRs2qTSDTBJ5/preview";

export const NEWSLETTER_ARCHIVE_LINK = "https://us19.campaign-archive.com/home/?u=8dc568d0db37b26ed75ba4d94&id=01f8128da2";

export function Spinner() {
    return (
        <div className="fadeInOutSpinner z-50 fixed top-0 left-0 w-full h-full bg-black bg-opacity-5 flex justify-center items-center"></div>
    );
}

// https://flowbite.com/docs/forms/file-input/
export function FileUploadDropzone(props: {
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    allowLargerFileSize?: number;
}) {
    return (
        <div className="flex items-center justify-center w-full">
            <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer white-50 dark:hover:bg-bray-800 dark:white-700 hover:white-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:white-600"
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                    </p>
                </div>
                <input
                    id="dropzone-file"
                    className="hidden"
                    type="file"
                    accept={ALL_IMAGE_FILE_TYPES_STR}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        let files = event.target.files;
                        if (files) {
                            let file_size = files[0].size;
                            
                            if(file_size > MAX_ALLOWABLE_IMAGE_FILE_SIZE || (props.allowLargerFileSize && file_size > props.allowLargerFileSize)) {
                                return toast.error(`File size too large!`);
                            }
                        }

                        props.handleFileChange(event);
                    }}
                />
            </label>
        </div>
    );
}
