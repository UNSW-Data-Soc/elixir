"use client";

import { endpoints } from "@/app/api/backend/endpoints";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
    FileUploadDropzone,
    Spinner,
    IMAGE_FILE_TYPES,
    RESOURCE_FILE_TYPES,
    MAX_ALLOWABLE_RESOURCE_FILE_SIZE,
} from "@/app/utils";
import { CreateResource } from "@/app/api/backend/resources";
import { Tooltip } from "@nextui-org/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
const ABOUT_YOU_CHAR_LIMIT = 200;

export default function CreateResource() {
    const router = useRouter();
    const session = useSession();

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [visible, setVisibility] = useState(true);
    const [resourceTypeFile, setResourceTypeFile] = useState(true);
    const [link, setLink] = useState("");
    const [file, setFile] = useState<Blob | null>(null);

    useEffect(() => {
        setLoading(false);
    }, []);

    if (session.status == "loading") return <></>;
    if (session.status === "unauthenticated" || !session.data?.user) {
        router.push("/");
        return <></>;
    }

    async function handleConfirm() {
        if (!resourceTypeFile && !isValidURL(link)) {
            return toast.error("Invalid link!");
        } else if (resourceTypeFile && !file) {
            return toast.error("Please upload a file!");
        } else if(title === "" || description === "") {
            return toast.error("Please ensure all fields are non-empty!")
        }

        let resource: CreateResource = {
            title: title,
            description: description,
            link: resourceTypeFile ? null : link,
            visibility: visible,
        };

        setLoading(true);
        let uploadedResource = await endpoints.resources.create(resource, file);
        if (!uploadedResource) {
            toast.error("Failed to create resource");
            setLoading(false);
            return;
        }

        setLoading(false);
        toast.success("Created resource successfully");
        router.push("/resources");
        return;
    }

    async function handleCancel() {
        return router.back();
    }

    async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        let files = event.target.files;
        setLoading(true);
        if (
            files &&
            (IMAGE_FILE_TYPES.includes(files[0].type) ||
                RESOURCE_FILE_TYPES.includes(files[0].type))
        ) {
            let blob = files[0];
            setFile(blob);
        } else {
            toast.error("Please upload a valid file!");
        }

        setLoading(false);
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
                    <div className="container m-auto flex flex-row justify-between flex-wrap">
                        <div>
                            <h1 className="py-3 text-5xl font-semibold">
                                New Resource
                            </h1>
                            <div></div>
                        </div>
                    </div>
                    <p className="py-5  text-2xl font-semibold">Title</p>
                    <input
                        className="py-3 px-4 border-2 rounded-xl transition-all"
                        type="text"
                        placeholder="Your title..."
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />
                    <p className="py-5  text-2xl font-semibold">Description</p>
                    <input
                        className="py-3 px-4 border-2 rounded-xl transition-all"
                        type="text"
                        placeholder="Your description..."
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                    />

                    <div className="flex gap-5 mr-8 mt-8 mb-8 items-center">
                        <p className="py-5  text-2xl font-semibold">
                            Link resource
                        </p>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={resourceTypeFile}
                                onChange={(e) => {
                                    setResourceTypeFile(!resourceTypeFile);
                                }}
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                        <p className="py-5  text-2xl font-semibold">
                            Upload file
                        </p>
                        <Tooltip
                            content={
                                "Link an existing resource or upload an image, pdf, csv or plain text file"
                            }
                        >
                            <QuestionMarkCircleIcon className="flex items-center justify-center align-baseline w-5" />
                        </Tooltip>
                    </div>

                    {resourceTypeFile && file === null && (
                        <FileUploadDropzone
                            handleFileChange={handleFileChange}
                            allowLargerFileSize={MAX_ALLOWABLE_RESOURCE_FILE_SIZE}
                        />
                    )}
                    {
                        resourceTypeFile && file !== null &&
                        <div className="flex item-center justify-center align-baseline outline outline-2 p-3 m-3">
                            <p>{file?.name}</p>
                        </div>
                    }

                    {!resourceTypeFile && (
                        <input
                        className="py-3 px-4 border-2 rounded-xl transition-all"
                        type="text"
                        placeholder="Add a link.."
                        value={link}
                        onChange={(e) => {
                            setLink(e.target.value);
                        }}
                    />
                    )}

                    <div className="flex gap-5 mr-8 mt-8 mb-8 items-center">
                        <p className="py-5  text-2xl font-semibold">Draft</p>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={visible}
                                onChange={(e) => {
                                    setVisibility(!visible);
                                }}
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                        <p className="py-5  text-2xl font-semibold">Publish</p>
                    </div>

                    <button
                        className="py-2 px-4 mr-2 bg-[#f0f0f0] mt-10 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
                        onClick={handleConfirm}
                    >
                        Add resource
                    </button>
                    <button
                        className="py-2 px-4 mr-2 bg-[#f0f0f0] mt-10 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            }
        </>
    );
}
