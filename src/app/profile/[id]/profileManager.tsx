"use client";

import { endpoints } from "@/app/api/backend/endpoints";
import { User } from "@/app/api/backend/users";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { FileUploadDropzone, Spinner, IMAGE_FILE_TYPES } from "@/app/utils";

const ABOUT_YOU_CHAR_LIMIT = 200;

export default function ProfileManager(props: { user_id: string }) {
    const router = useRouter();
    const session = useSession();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");

    useEffect(() => {
      endpoints.users.get(props.user_id).then((user) => {
        if(!user) {
          toast.error("Failed to retrieve profile");
          router.push("/")
          return <></>;
        }
        setUser(user);
        setEmail(user.email);
        setName(user.name);
        setAbout(user.about);
        setLoading(false);
      });
    }, []);

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

    async function handleConfirm() {
      if(user && email && name) {
        setLoading(true);
        let updated_profile = await endpoints.users.updateProfile(user.id, email, name, about);
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

    async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
      if(!user) return toast.error("You do not have persmission to view this page");
      let files = event.target.files;
      setLoading(true);
      if(files && IMAGE_FILE_TYPES.includes(files[0].type)) {
        let blob = files[0];
        let uploaded_photo = await endpoints.users.uploadProfilePicture(user.id, blob);

        if (!uploaded_photo) {
          toast.error("Failed to upload photo.");
          setLoading(false);
          return;
        }

        toast.success("Photo uploaded successfully");
      } else {
        toast.error("Please upload a valid file!")
      }

      setLoading(false);
    }
    
    return (
      <>
        { loading && <Spinner/> }
        {
          user && (
            <div className="container m-auto flex flex-col">
              <div className="container m-auto flex flex-row justify-between gap-5 p-10 flex-wrap ">
                <div>
                  <h1 className="text-5xl font-semibold">{user.name}</h1>
                  <div>
                    <p className="text-1xl opacity-50">Registered on {dayjs(Date.parse(user.registration_time)).toLocaleString()}</p>
                    <p className="text-1xl opacity-50">{user.access_level.toUpperCase()}</p>
                  </div>
                </div>
                <Image
                  className="border-4 outline-double"
                  src={endpoints.users.getUserProfilePicture(user.id)}
                  alt="Profile picture"
                  placeholder="empty"
                  width={500}
                  height={500}
                />
              </div>
              <p className="py-5  text-2xl font-semibold">Email</p>
              <input
                  className="py-3 px-4 border-2 rounded-xl transition-all"
                  type="text"
                  placeholder="Your email..."
                  value={email}
                  onChange={(e) => {setEmail(e.target.value)}}
              />
              <p className="py-5  text-2xl font-semibold">Name</p>
              <input
                  className="py-3 px-4 border-2 rounded-xl transition-all"
                  type="text"
                  placeholder="Your name..."
                  value={name}
                  onChange={(e) => {setName(e.target.value)}}
              />
              <p className="py-5 text-2xl font-semibold">About you</p>
              <input
                  className="py-3 px-4 border-2 rounded-xl transition-all"
                  type="text"
                  placeholder="Write a short description here..."
                  value={about}
                  onChange={(e) => {setAbout(e.target.value)}}
                  maxLength={ABOUT_YOU_CHAR_LIMIT}
              />

              <p className="py-5 text-2xl font-semibold">Profile picture</p>
              
              <FileUploadDropzone
                handleFileChange={handleFileChange}
              />

              
              <button
                className='py-2 px-4 mr-2 bg-[#f0f0f0] mt-10 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all'
                onClick={handleConfirm}
              >
              Save changes
              </button>
          </div>
        )
        }
      </>
    );
}
