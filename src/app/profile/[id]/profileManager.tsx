"use client";

import { endpoints } from "@/app/api/backend/endpoints";
import { User } from "@/app/api/backend/users";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { PROFILE_PIC_X_PXL, PROFILE_PIC_Y_PXL, Spinner } from "@/app/utils";
import PhotoUploader from "../../photoUploader";

const ABOUT_YOU_CHAR_LIMIT = 200;

export default function ProfileManager(props: { user_id: string }) {
    const router = useRouter();
    const session = useSession();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [profilePicURL, setProfilePicURL] = useState("");

    useEffect(() => {
        endpoints.users.getInfo(props.user_id).then((user) => {
            if (!user) {
                toast.error("Failed to retrieve profile");
                router.push("/");
                return <></>;
            }
            setUser(user);
            setEmail(user.email);
            setName(user.name);
            setAbout(user.about);
            setProfilePicURL(endpoints.users.getUserProfilePicture(user.id));
            setLoading(false);
        });
    }, [props.user_id]);

    if (session.status == "loading") return <></>;
    if (
        session.status === "unauthenticated" ||
        !session.data?.user ||
        session.data.user.id !== props.user_id
    ) {
        toast.error("You do not have persmission to view this page");
        router.push("/");
        return <></>;
    }

    async function handleSaveProfile() {
        if (user && email && name) {
            setLoading(true);
            let updated_profile = await endpoints.users.updateProfile(
                user.id,
                email,
                name,
                about
            );
            if (!updated_profile) {
                toast.error("Failed to update user permissions");
                setLoading(false);
                return;
            }

            setLoading(false);
            toast.success("Updated profile successfully");
            user.name = name;
            user.email = email;
            user.about = about;
            return;
        }
        toast.error("Failed to update user permissions");
    }

    async function uploadCroppedPhoto(blob: Blob) {
        setLoading(true);
        if (!user)
            return toast.error("You do not have persmission to view this page");

        let uploaded_photo = await endpoints.users.uploadProfilePicture(
            user.id,
            blob
        );

        if (!uploaded_photo) {
            toast.error("Failed to upload photo.");
            setLoading(false);
            return;
        }

        setLoading(false);
        toast.success("Photo uploaded successfully");
        // append timestamp to update displayed photo immediately and bypass cache policy
        setProfilePicURL(
            endpoints.users.getUserProfilePicture(user.id) +
                `&timestamp${Date.now()}`
        );
    }

    async function cancelUploadingCroppedPhoto() {

    }

    return (
        <>
            {loading && <Spinner />}
            {user && (
                <div className="container m-auto flex flex-col">
                    <div className="container m-auto flex flex-row justify-between flex-wrap">
                        <div>
                            <h1 className="py-3 text-5xl font-semibold">
                                {user.name}
                            </h1>
                            <div>
                                <p className="text-1xl opacity-50">
                                    Registered on{" "}
                                    {dayjs(
                                        Date.parse(user.registration_time)
                                    ).toLocaleString()}
                                </p>
                                <p className="text-1xl opacity-50">
                                    {user.access_level.toUpperCase()}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center">
                            <div className="w-6/12">
                                <Image
                                    src={profilePicURL}
                                    className="shadow rounded max-w-full h-auto align-middle border-none"
                                    alt="Profile picture"
                                    placeholder="empty"
                                    width={PROFILE_PIC_X_PXL}
                                    height={PROFILE_PIC_X_PXL}
                                />
                            </div>
                        </div>
                    </div>
                    <p className="py-5  text-2xl font-semibold">Email</p>
                    <input
                        className="py-3 px-4 border-2 rounded-xl transition-all"
                        type="text"
                        placeholder="Your email..."
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <p className="py-5  text-2xl font-semibold">Name</p>
                    <input
                        className="py-3 px-4 border-2 rounded-xl transition-all"
                        type="text"
                        placeholder="Your name..."
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                    <p className="py-5 text-2xl font-semibold">About you</p>
                    <input
                        className="py-3 px-4 border-2 rounded-xl transition-all"
                        type="text"
                        placeholder="Write a short description here..."
                        value={about}
                        onChange={(e) => {
                            setAbout(e.target.value);
                        }}
                        maxLength={ABOUT_YOU_CHAR_LIMIT}
                    />

                    <p className="py-5 text-2xl font-semibold">
                        Profile picture
                    </p>

                    <PhotoUploader
                        uploadCroppedPhoto={uploadCroppedPhoto}
                        cancelUploadingCroppedPhoto={
                            cancelUploadingCroppedPhoto
                        }
                        xPixels={PROFILE_PIC_X_PXL}
                        yPixels={PROFILE_PIC_Y_PXL}
                    />

                    <button
                        className="py-2 px-4 mr-2 bg-[#f0f0f0] mt-10 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
                        onClick={handleSaveProfile}
                    >
                        Save changes
                    </button>
                </div>
            )}
        </>
    );
}
