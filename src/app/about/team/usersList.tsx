"use client";

import { endpoints } from "../../api/backend/endpoints";
import { User, UserPublic } from "../../api/backend/users";
import { CSSProperties, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Spinner } from "../../utils";

export default function UsersList() {
    const [users, setUsers] = useState<UserPublic[]>([]);
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

    // TODO: sort by portfolio
    function sortUsers(a: UserPublic, b: UserPublic): number {
        return a.name.localeCompare(b.name);
    }

    function getUserCardStyle(user: UserPublic): CSSProperties {
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
                                <div
                                    className="py-2 px-4 mr-2 bg-[#f0f0f0] mt-10 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all cursor-pointer"
                                    onClick={() => handleYearChange(year)}
                                >
                                    <button>
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
