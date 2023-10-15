"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { endpoints } from "../api/backend/endpoints";
import { User } from "../api/backend/users";
import { CSSProperties, use, useEffect, useState } from "react";
import UserDialogueInfo from "./userPermissionsDialog";
import toast from "react-hot-toast";
import { Spinner } from "../utils";
import { Tag } from "../api/backend/tags";
import { Card, CardBody, CardHeader, Image} from "@nextui-org/react";

export default function UsersList(props: {tags: Tag[]}) {
    const router = useRouter();
    const session = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [showModalUser, setShowModalUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        endpoints.users.getAllInfo().then((users) => {
            setUsers(users);
            setLoading(false);
        }).catch(() => {
            toast.error("You do not have permission to view this page");
            router.push("/");
        });
    }, []);

    if (session.status == "loading") return <></>;
    if (session.status === "unauthenticated" || !session.data?.user.admin)
        return redirect("/");

    if (!users) {
        toast.error("Failed to get users.");
        return <></>;
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
            if (u.id === user.id) {
                new_users.push(user);
            } else {
                new_users.push(u);
            }
        }

        setUsers(new_users);
    }

    function removeUser(id: string) {
        let new_users: User[] = [];
        for (let u of users) {
            if (u.id !== id) {
                new_users.push(u);
            }
        }

        setUsers(new_users);
    }

    function getUserCardStyle(user: User): CSSProperties {
        let bgColour = "#DDFFBB";
        let opacity = 1;
        if(user.access_level === "moderator") {bgColour = "salmon"}
        else if(user.access_level === "administrator") {bgColour = "#B4E4FF"}

        if (user.retired) {
            opacity = 0.6;
        }

        return {
            backgroundColor: bgColour,
            opacity: opacity,
        };
    }

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
                    {users.sort(sortUsers).map((user) => (
                        <Card key={user.id} style={getUserCardStyle(user)} isBlurred isPressable radius="lg" className="border-none" onPress={() =>{ setShowModal(true); setShowModalUser(user);}}>
                                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                        <small className="text-default-500">{}</small>
                                        <h4 className="font-bold text-large">{user.name}</h4>
                                    </CardHeader>
                                    <CardBody className="overflow-visible py-2">
                                        <Image
                                            src={endpoints.users.getUserProfilePicture(
                                                user.id
                                            )}
                                            alt="Profile picture"
                                            className="object-cover rounded-xl"
                                            height={300}
                                            width={300}
                                        />
                                    </CardBody>
                                </Card>
                    ))}
                    {showModal && showModalUser && <UserDialogueInfo
                        isModalOpen={showModal}
                        user={{ ...showModalUser }}
                        tags={props.tags}
                        closeModal={() => {
                            setShowModal(false);
                            setShowModalUser(null);
                        }}
                        updateUser={updateUser}
                        removeUser={removeUser}
                    />}
                </div>
            )}
        </>
    );
}
