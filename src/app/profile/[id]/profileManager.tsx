"use client";

import { endpoints } from "@/app/api/backend/endpoints";
import { User } from "@/app/api/backend/users";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const ABOUT_YOU_CHAR_LIMIT = 200;

export default function ProfileManager(props: { user_id: string }) {
    const router = useRouter();
    const session = useSession();

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User>();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [portfolio, setPortfolio] = useState("");
    const [about, setAbout] = useState("");

    useEffect(() => {
      setLoading(true);
      endpoints.users.get(props.user_id).then((user) => {
        if(!user) {
          toast.error("Failed to retrieve profile");
          router.push("/")
          return <></>;
        }
        setUser(user);
        setEmail(user.email);
        setName(user.name);
        setPortfolio(user.portfolio);
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

    if(loading) return <p> Loading ... </p>;
    
    return (
      <>
        {
          user &&(
            <div className="container m-auto flex flex-col gap-5 p-10 flex-wrap justify-center">
              <h1 className="text-5xl font-semibold">Profile Management</h1>
              <div>
                <p className="text-1xl opacity-50">Registered on {dayjs(Date.parse(user.registration_time)).toLocaleString()}</p>
                <p className="text-1xl opacity-50">{user.access_level.toUpperCase()}</p>
              </div>
              <p className="text-2xl font-semibold">Email</p>
              <input
                  className="py-3 px-4 border-2 rounded-xl transition-all"
                  type="text"
                  placeholder="Your email..."
                  value={email}
                  onChange={(e) => {setEmail(e.target.value)}}
              />
              <p className="text-2xl font-semibold">Name</p>
              <input
                  className="py-3 px-4 border-2 rounded-xl transition-all"
                  type="text"
                  placeholder="Your name..."
                  value={name}
                  onChange={(e) => {setName(e.target.value)}}
              />
              <p className="text-2xl font-semibold">Portfolio</p>
              <input
                  className="py-3 px-4 border-2 rounded-xl transition-all"
                  type="text"
                  placeholder="The portfolio you are a part of..."
                  value={portfolio}
                  onChange={(e) => {setPortfolio(e.target.value)}}
              />
              <p className="text-2xl font-semibold">About you</p>
              <input
                  className="py-3 px-4 border-2 rounded-xl transition-all"
                  type="text"
                  placeholder="Write a short description here..."
                  value={about}
                  onChange={(e) => {setAbout(e.target.value)}}
                  maxLength={ABOUT_YOU_CHAR_LIMIT}
              />
          </div>
        )}
      </>
    );
}
