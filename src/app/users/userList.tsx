"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { endpoints } from "../api/backend/endpoints";
import { User } from "../api/backend/users";
import { CSSProperties, use, useEffect, useState } from "react";
import UserDialogueInfo from "./userPermissionsDialog";
import toast from "react-hot-toast";
import Image from "next/image";
import { Spinner } from "../utils";

export default function UsersList() {
    const router = useRouter();
    const session = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [showModalUser, setShowModalUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        endpoints.users.getAll().then((users) => {
            setUsers(users);
            setLoading(false);
        });
    }, []);

    if (session.status == "loading") return <></>;
    if (session.status === "unauthenticated" || !session.data?.user.admin)
        return redirect("/");

    if (!users) {
        toast.error("Failed to get users.");
        return <></>;
    }

    function getUserBannerStyle(user: User): CSSProperties {
        let bgColour = "lightgreen";
        let opacity = 1;

        if (user.access_level == "moderator") {
            bgColour = "lightblue";
        } else if (user.access_level == "administrator") {
            bgColour = "lightsalmon";
        }

        if (user.retired) {
            opacity = 0.5;
        }

        return {
            backgroundColor: bgColour,
            opacity: opacity,
        };
    }

    // user ordering: admin, mods, members
    // with ties broken alphabetically
    function sortUsers(a: User, b: User): number {
        const order = { administrator: 0, moderator: 1, member: 2 };

        if (a.access_level != b.access_level) {
            return order[a.access_level] - order[b.access_level];
        }

        return a.name.localeCompare(b.name);
    }

    function updateUser(user: User) {
        let new_users: User[] = [];
        for (let u of users) {
            if (u.id == user.id) {
                new_users.push(user);
            } else {
                new_users.push(u);
            }
        }

        setUsers(new_users);
    }

    function getUserCardStyle(user: User): CSSProperties {
        return {
            backgroundImage: user.photo ? "" : "url(/logo_greyscale.jpeg)",
            backgroundOrigin: "content-box",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            cursor: "pointer",
        };
    }

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
                    {users.sort(sortUsers).map((user) => (
                        <div
                            key={user.id}
                            className="border-[1px] border-black flex flex-col items-center w-4/12"
                            style={getUserBannerStyle(user)}
                        >
                            <div
                                className="w-full relative h-[200px]"
                                style={getUserCardStyle(user)}
                                onClick={() => {
                                    setShowModal(true);
                                    setShowModalUser(user);
                                }}
                            >
                                {user.photo && (
                                    <Image
                                        fill
                                        src={endpoints.users.getUserProfilePicture(
                                            user.id
                                        )}
                                        alt="Profile picture"
                                        sizes="100vw"
                                    />
                                )}
                            </div>
                            <div className="flex flex-col gap-3 p-5 items-center">
                                <h3 className="text-xl font-bold">
                                    {user.name}
                                </h3>
                                <p className="">
                                    <span className="italic">{user.email}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                    {showModal && showModalUser && (
                        <UserDialogueInfo
                            user={{ ...showModalUser }}
                            closeModal={() => {
                                setShowModal(false);
                                setShowModalUser(null);
                            }}
                            updateUser={updateUser}
                        />
                    )}
                </div>
            )}
        </>
    );
}
