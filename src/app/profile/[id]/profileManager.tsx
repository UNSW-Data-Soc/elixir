"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { useEffect, useState } from "react";

import { AvatarIcon } from "@nextui-org/avatar";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import { PROFILE_PIC_X_PXL, PROFILE_PIC_Y_PXL, Spinner } from "@/app/utils";
import {
  getUserProfilePicKey,
  getUserProfilePicRoute,
  upload,
} from "@/app/utils/s3";

import PhotoUploader from "../../photoUploader";

import dayjs from "dayjs";
import { toast } from "react-hot-toast";

const ABOUT_YOU_CHAR_LIMIT = 200;
const USER_INFO_LOADING_TOAST_ID = "userinfoloading";

export default function ProfileManager(props: { userId: string }) {
  const router = useRouter();
  const session = useSession();

  // form states
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [profilePicURL, setProfilePicURL] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<Blob | null>(null);

  const ctx = api.useUtils();

  const {
    data: user,
    isLoading,
    isError,
  } = api.users.getInfo.useQuery({
    id: props.userId,
  });

  const { mutate: updateUserInfo } = api.users.updateInfo.useMutation({
    onMutate: () => {
      toast.loading("Updating user info...", {
        id: USER_INFO_LOADING_TOAST_ID,
      });
    },
    onSettled: () => {
      toast.dismiss(USER_INFO_LOADING_TOAST_ID);
    },
    onSuccess: async ({ id, imageId }) => {
      if (!profilePic || !user || !imageId) {
        return;
      }

      const res = await upload(profilePic, getUserProfilePicKey(id, imageId));

      if (!res.ok) {
        toast.error("Failed to upload profile photo.");
        return;
      }

      setProfilePic(null);

      void ctx.users.getInfo.invalidate();

      toast.success("Profile updated successfully");
    },
    onError: (e) => {
      toast.error(`Error updating profile: ${e.message}`);
    },
  });

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setAbout(user.about ?? "");
    setProfilePicURL(
      user.image ? getUserProfilePicRoute(user.id, user.image) : null,
    );
  }, [user]);

  if (session.status == "loading" || isLoading) return <Spinner />;
  if (
    session.status === "unauthenticated" ||
    !session.data?.user ||
    (session.data.user.id !== props.userId &&
      session.data.user.role !== "admin")
  ) {
    toast.error("You do not have permission to view this page.");
    router.push("/");
    return <></>;
  }

  if (isError) {
    toast.error("Failed to get user profile.");
    router.push("/");
  }

  async function handleSaveProfile() {
    if (!user || !name) {
      toast.error("Failed to update user permissions");
      return;
    }
    updateUserInfo({
      id: user.id,
      name: name,
      about: about,
      imageFileType: profilePic?.type,
    });
  }

  return (
    <>
      {isLoading && <Spinner />}
      {user && (
        <div className="container m-auto flex flex-col">
          <div className="container m-auto flex flex-row flex-wrap justify-between">
            <div>
              <h1 className="py-3 text-5xl font-semibold">{user.name}</h1>
              <div>
                <p className="text-1xl opacity-50">
                  Registered on {dayjs(user.registered).toLocaleString()}
                </p>
                <p className="text-1xl opacity-50">{user.role.toUpperCase()}</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center">
              <div className="flex aspect-square w-6/12 items-center justify-center rounded-2xl bg-[#eee]">
                {!!profilePicURL ? (
                  <Image
                    src={profilePicURL}
                    className="h-auto max-w-full rounded border-none align-middle shadow"
                    alt="Profile picture"
                    placeholder="empty"
                    width={PROFILE_PIC_X_PXL}
                    height={PROFILE_PIC_X_PXL}
                  />
                ) : (
                  <AvatarIcon />
                )}
              </div>
            </div>
          </div>
          <p className="py-5  text-2xl font-semibold">Name</p>
          <input
            className="rounded-xl border-2 px-4 py-3 transition-all"
            type="text"
            placeholder="Your name..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <p className="py-5 text-2xl font-semibold">About you</p>
          <input
            className="rounded-xl border-2 px-4 py-3 transition-all"
            type="text"
            placeholder="Write a short description here..."
            value={about}
            onChange={(e) => {
              setAbout(e.target.value);
            }}
            maxLength={ABOUT_YOU_CHAR_LIMIT}
          />

          <p className="py-5 text-2xl font-semibold">Profile picture</p>

          <PhotoUploader
            uploadCroppedPhoto={(photo: Blob) => setProfilePic(photo)}
            cancelUploadingCroppedPhoto={() => setProfilePic(null)}
            xPixels={PROFILE_PIC_X_PXL}
            yPixels={PROFILE_PIC_Y_PXL}
          />

          <button
            className="mr-2 mt-10 rounded-xl border-2 bg-[#f0f0f0] px-4 py-2 transition-all hover:border-blue-300 hover:bg-[#ddd]"
            onClick={handleSaveProfile}
          >
            Save changes
          </button>
        </div>
      )}
    </>
  );
}
