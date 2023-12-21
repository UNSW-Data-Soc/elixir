"use client";

import { useSession } from "next-auth/react";

import React, { useEffect, useState } from "react";

import {
  Button,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  User as UserAvatar,
} from "@nextui-org/react";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import { Spinner } from "../utils";
import { getUserProfilePicRoute } from "../utils/s3";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";
import Select, { MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";

dayjs.extend(relativeTime);

type User = RouterOutputs["users"]["getAll"][number];
const userLevels = ["admin", "moderator", "user"] as const;
type UserLevels = (typeof userLevels)[number];

export default function UserDialogueInfo(props: {
  isModalOpen: boolean;
  user: User;
  closeModal: () => void;
}) {
  const session = useSession();

  const ctx = api.useUtils();

  const [role, setRole] = useState<UserLevels>(props.user.role);
  const [year, setYear] = useState<string>("");
  const [yearsActive, setYearsActive] = useState<
    MultiValue<{ label: number; value: number }>
  >([]);
  const [retired, setRetired] = useState(props.user.retired);

  const [showUserDeletionDialog, setShowUserDeletionDialog] = useState(false);

  const { mutate: updateUserRole } = api.users.updateRole.useMutation({
    onSuccess: () => {
      toast.success("Updated user permissions");
      void ctx.users.invalidate();
    },
    onError: (e) => {
      toast.error(`Failed to update user permissions: ${e.message}`);
    },
  });

  const { mutate: deleteUser } = api.users.delete.useMutation({
    onSuccess: () => {
      toast.success("Successfully deleted user");
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  async function handleConfirm() {
    updateUserRole({ id: props.user.id, role });
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
        } else if (yearsActive.map((mv) => mv.value).indexOf(+year) !== -1) {
          toast.error("Year already exists");
          return;
        }
        let new_years = [...yearsActive, createYearOption(+year)];
        setYearsActive(new_years);
        setYear("");
        event.preventDefault();
    }
  }

  const permissionsOptions: {
    value: UserLevels;
    label: string;
    isDisabled: boolean;
  }[] = [
    {
      value: "user",
      label: "Member",
      isDisabled: props.user.role === "user",
    },
    {
      value: "moderator",
      label: "Moderator",
      isDisabled: props.user.role === "moderator",
    },
    {
      value: "admin",
      label: "Administrator",
      isDisabled: props.user.role === "admin",
    },
  ];

  const retiredOptions: {
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

  function DeleteUserConfirmationDialog() {
    // const registeredTime = dayjs(Date.parse(props.user.registration_time));

    return (
      <>
        <Modal
          isOpen={showUserDeletionDialog}
          onOpenChange={() => setShowUserDeletionDialog(false)}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Are you sure?
                  <small className="text-default-500">{`${props.user.name}`}</small>
                  <small className="text-default-500">{`${props.user.email}`}</small>
                  {/* <Tooltip content={registeredTime.format("DD/MM/YYYY HH:mm")}>
                    <small className="text-default-500">{`Registered on ${registeredTime}`}</small>
                  </Tooltip> */}
                </ModalHeader>
                <ModalBody>
                  <p>
                    This action will permanently delete the user &apos;
                    {props.user.name}&apos;
                  </p>
                  <p>
                    All blogs, events, job postings etc. created by this user
                    will not be deleted, but the &apos;creator&apos; field will
                    may appear empty.
                  </p>
                  <p>
                    The user will also be removed from the &apos;Our Team&apos;
                    page if they are active in any years.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      deleteUser({ id: props.user.id });
                      onClose();
                    }}
                  >
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

  return (
    <>
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
                  src: props.user.image
                    ? getUserProfilePicRoute(props.user.id, props.user.image)
                    : "./logo.png", // TODO: default profile picture (also move null handling to helper function)
                  size: "lg",
                  color: "success",
                  showFallback: true,
                }}
              />

              <ModalBody>
                <Divider />
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
                          setRole(value.value);
                        }
                      }}
                      defaultValue={{
                        value: role,
                        label: role.charAt(0).toUpperCase() + role.slice(1),
                        isDisabled: true,
                      }}
                    />
                    <p className="text-2xl font-semibold py-5">Years active</p>
                    <CreatableSelect
                      components={{
                        DropdownIndicator: null,
                      }}
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
                    <p className="text-2xl font-semibold py-5">Retired</p>
                    <Select
                      options={retiredOptions}
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
                    {/* <p className="text-2xl font-semibold py-5">Portfolio</p>
                    {yearsActive.map((y) => {
                      return (
                        <>
                          <p className="font-semibold">{y.value}</p>
                          <ModifyBearerTags
                            bearer="portfolio"
                            bearer_id={props.user.id}
                            tagLimit={1}
                            initialOptionsFilter={(ai) =>
                              ai.bearer_id === props.user.id &&
                              ai.tag_year !== undefined &&
                              ai.tag_year === y.value
                            }
                            portfolio_year={y.value}
                          />
                        </>
                      );
                    })} */}

                    {session.data && props.user.id !== session.data.user.id && (
                      <Button
                        color="danger"
                        variant="ghost"
                        onPress={() => setShowUserDeletionDialog(true)}
                      >
                        Delete Account
                      </Button>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={props.closeModal}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => {
                    handleConfirm();
                    props.closeModal();
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <DeleteUserConfirmationDialog />
    </>
  );
}
