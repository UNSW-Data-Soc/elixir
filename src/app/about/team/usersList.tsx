"use client";

import { endpoints } from "../../api/backend/endpoints";
import { User } from "../../api/backend/users";
import { CSSProperties, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Spinner } from "../../utils";

export default function UsersList() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [years, setYears] = useState<Number[]>([]);

    useEffect(() => {
        const getData = async () => {
            let yearsData = await endpoints.users.getYears();
            yearsData = yearsData.sort().reverse();
            let usersData = await endpoints.users.getUsersByYears(yearsData[0]);
            setYears(yearsData);
            setUsers(usersData);
            setLoading(false);
        };

        getData();
    }, []);

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

    // TODO: sort by portfolio
    function sortUsers(a: User, b: User): number {
        const order = { administrator: 0, moderator: 1, member: 2 };

        if (a.access_level != b.access_level) {
            return order[a.access_level] - order[b.access_level];
        }

        return a.name.localeCompare(b.name);
    }

    function getUserCardStyle(user: User): CSSProperties {
        return {
            backgroundImage: user.photo ? "" : "url(/logo_greyscale.jpeg)",
            backgroundOrigin: "content-box",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
        };
    }

    async function handleYearChange(year: Number) {
        if (!years.includes(year)) return toast.error("Invalid year!");

        setLoading(true);
        let usersData = await endpoints.users.getUsersByYears(year);
        setUsers(usersData);
        setLoading(false);
    }

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="container">
                    <div className="flex gap-5 justify-center">
                        {years.map((year) => {
                            return (
                                <div className="py-2 px-4 mr-2 bg-[#f0f0f0] mt-10 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all cursor-pointer">
                                    <button
                                        onClick={() => handleYearChange(year)}
                                    >
                                        {`${year}`}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
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
                                    {
                                        // TODO: add portfolio
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
