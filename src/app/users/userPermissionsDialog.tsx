"use client";

import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { User, userLevels } from "../api/backend/users";
import { endpoints } from "../api/backend/endpoints";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Spinner } from "../utils";
import { AttachmentInfo, Tag } from "../api/backend/tags";
import ModifyBearerTags from "../modifyBearerTags";

export default function UserDialogueInfo(props: {
    user: User;
    tags: Tag[],
    updateUser: (user: User) => void;
    closeModal: Function;
}) {
    const router = useRouter();

    const [accessLevel, setAccessLevel] = useState<userLevels>(
        props.user.access_level
    );
    const [year, setYear] = useState<string>("");
    const [yearsActive, setYearsActive] = useState<
        MultiValue<{ label: number; value: number }>
    >([]);
    const [retired, setRetired] = useState(props.user.retired);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getUserDetails() {
            let newYearsActive = [];
            for (let y of props.user.years_active) {
                newYearsActive.push(createYearOption(y));
            }
            setYearsActive(newYearsActive);
        }

        getUserDetails();
    }, [props.user]);

    async function handleConfirm() {
        setLoading(true);
        // if access level actually changed
        let updated_years_active_arr = yearsActive.map((mv) => mv.value);

        const updatedUser = await endpoints.users.updateUser({
            id: props.user.id,
            access_level: accessLevel,
            years_active: updated_years_active_arr,
            retired: retired,
        });

        if (!updatedUser) {
            toast.error("Failed to update user permissions");
            setLoading(false);
            return;
        }

        // update parent component after successful change
        let updated_user = { ...props.user };
        updated_user.access_level = accessLevel;
        updated_user.years_active = updated_years_active_arr;
        updated_user.retired = retired;
        props.updateUser(updated_user);

        router.push("/users");
        toast.success("Updated user permissions");
        setLoading(false);
    }

    const createYearOption = (label: number) => ({
        label,
        value: label,
    });

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        if (!year) return;
        switch (event.key) {
            case "Enter":
            case "Tab":
                if (isNaN(+year) || +year < 1000 || +year > 9999) {
                    toast.error("Please enter a valid year");
                    return;
                } else if (
                    yearsActive.map((mv) => mv.value).indexOf(+year) !== -1
                ) {
                    toast.error("Year already exists");
                    return;
                }
                let new_years = [...yearsActive, createYearOption(+year)];
                setYearsActive(new_years);
                setYear("");
                event.preventDefault();
        }
    }

    let permissionsOptions: {
        value: userLevels;
        label: string;
        isDisabled: boolean;
    }[] = [
        {
            value: "member",
            label: "Member",
            isDisabled: props.user.access_level === "member",
        },
        {
            value: "moderator",
            label: "Moderator",
            isDisabled: props.user.access_level === "moderator",
        },
        {
            value: "administrator",
            label: "Administrator",
            isDisabled: props.user.access_level === "administrator",
        },
    ];

    let retired_options: {
        value: boolean;
        label: string;
        isDisabled: boolean;
    }[] = [
        {
            value: true,
            label: "Yes",
            isDisabled: false,
        },
        {
            value: false,
            label: "No",
            isDisabled: false,
        },
    ];

    return (
        <>
            {loading && <Spinner />}
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-12 rounded-xl">
                    <p className="text-2xl font-semibold">{props.user.name}</p>
                    <p className="text-1xl font">{props.user.email}</p>
                    <hr />
                    <br></br>
                    <div>
                        <div className="flex flex-col gap-2 pb-3">
                            <p className="text-2xl font-semibold py-5">
                                Access permissions
                            </p>
                            <Select
                                options={permissionsOptions}
                                classNamePrefix="select"
                                isSearchable={true}
                                name="accessLevel"
                                onChange={(value) => {
                                    if (value) {
                                        setAccessLevel(value.value);
                                    }
                                }}
                                defaultValue={{
                                    value: accessLevel,
                                    label:
                                        accessLevel.charAt(0).toUpperCase() +
                                        accessLevel.slice(1),
                                    isDisabled: true,
                                }}
                            />
                            <p className="text-2xl font-semibold py-5">
                                Years active
                            </p>
                            <CreatableSelect
                                components={{ DropdownIndicator: null }}
                                inputValue={year.toString()}
                                isClearable
                                isMulti
                                menuIsOpen={false}
                                onChange={(newVal) => setYearsActive(newVal)}
                                onInputChange={(newVal) => setYear(newVal)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter a year and press enter..."
                                value={yearsActive}
                            />
                            <p className="text-2xl font-semibold py-5">
                                Retired
                            </p>
                            <Select
                                options={retired_options}
                                classNamePrefix="select"
                                isSearchable={true}
                                name="retired"
                                onChange={(value) => {
                                    if (value) {
                                        setRetired(value.value);
                                    }
                                }}
                                defaultValue={{
                                    value: retired,
                                    label: retired ? "Yes" : "No",
                                    isDisabled: false,
                                }}
                            />
                            <p className="text-2xl font-semibold py-5">Portfolio</p>
                            <ModifyBearerTags
                                bearer="portfolio"
                                bearer_id={props.user.id}
                                tagLimit={1}
                                initialOptionsFilter={ai => ai.bearer_id === props.user.id}
                            />
                        </div>
                    </div>

                    <button
                        className="py-2 px-4 mr-2 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
                        onClick={() => {
                            handleConfirm();
                            props.closeModal();
                        }}
                    >
                        Confirm
                    </button>
                    <button
                        className="py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
                        onClick={() => props.closeModal()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
}
