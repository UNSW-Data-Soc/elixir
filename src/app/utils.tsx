import { ChangeEvent } from "react";

export const ALL_IMAGE_FILE_TYPES = "image/png, image/jpg, image/gif, image/jpeg, image/webp";
export const IMAGE_FILE_TYPES = ["image/png", "image/jpg", "image/gif", "image/jpeg", "image/webp"];

export function Spinner() {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-5 flex justify-center items-center">
            <span className="loader" />
        </div>
    );
}

// https://flowbite.com/docs/forms/file-input/
export function FileUploadDropzone(props: {handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void}) {
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
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
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
                    accept={ALL_IMAGE_FILE_TYPES}
                    onChange={props.handleFileChange}
                />
            </label>
        </div>
    );
}
