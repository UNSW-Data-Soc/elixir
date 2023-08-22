"use client";

import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { User, userLevels } from "../api/backend/users";
import { endpoints } from "../api/backend/endpoints";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Spinner } from "../utils";
import { Tag } from "../api/backend/tags";
import ModifyBearerTags from "../modifyBearerTags";
import { Modal, ModalContent, ModalHeader, User as UserAvatar, Image, ModalBody, Divider, ModalFooter, Button } from "@nextui-org/react";

export default function UserDialogueInfo(props: {
    isModalOpen: boolean,
    user: User;
    tags: Tag[],
    updateUser: (user: User) => void;
    closeModal: () => void;
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
            <Modal isOpen={props.isModalOpen} onOpenChange={() => props.closeModal()}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                            <UserAvatar
                                name={props.user.name}
                                description={props.user.email}
                                avatarProps={{
                                    isBordered: true,
                                    src: endpoints.users.getUserProfilePicture(props.user.id),
                                    size: "lg",
                                    color: "success",
                                    showFallback: true,
                                }}
                            />

                            <ModalBody>
                                <Divider/>
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
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={props.closeModal}>
                                    Cancel
                                </Button>
                                <Button color="primary" variant="light" onPress={() => {handleConfirm(); props.closeModal()}}>
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
