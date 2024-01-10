"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import React, { useState } from "react";

import {
  Button,
  Divider,
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
import {
  DirectorRole,
  ExecRole,
  SubcomRole,
  UserLevel,
  userLevels,
} from "@/trpc/types";

import { getUserProfilePicRoute } from "../utils/s3";
import UpdateYearsActive from "./updateYearsActive";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";
import Select from "react-select";

dayjs.extend(relativeTime);

type User = RouterOutputs["users"]["getAll"][number];

export default function UserDialogueInfo(props: {
  isModalOpen: boolean;
  user: User;
  closeModal: () => void;
}) {
  const session = useSession();
  const router = useRouter();

  const ctx = api.useUtils();

  const [role, setRole] = useState<UserLevel>(props.user.role);

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

  function handleConfirm() {
    updateUserRole({ id: props.user.id, role, retired: retired ?? undefined });
  }

  const permissionsOptions = userLevels.map((userLevel) => ({
    value: userLevel,
    label: userLevel.charAt(0).toUpperCase() + userLevel.slice(1),
    isDisabled: props.user.role === userLevel,
  }));

  const retiredOptions = [true, false].map((retired) => ({
    value: retired,
    label: retiredToLabel(retired),
    isDisabled: false,
  }));

  return (
    <>
      <Modal isOpen={props.isModalOpen} onOpenChange={() => props.closeModal()}>
        <ModalContent className="flex flex-col gap-5">
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
              <Divider />
              <ModalBody className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <p className="text-2xl font-semibold">Access permissions</p>
                  <Select
                    options={permissionsOptions}
                    classNamePrefix="select"
                    isSearchable={true}
                    name="accessLevel"
                    onChange={(value) => {
                      if (value) setRole(value.value);
                    }}
                    defaultValue={{
                      value: role,
                      label: role.charAt(0).toUpperCase() + role.slice(1),
                      isDisabled: true,
                    }}
                  />
                </div>
                <UpdateYearsActive user={props.user} />
                <div className="flex flex-col gap-3">
                  <p className="text-2xl font-semibold">Retired</p>
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
                </div>
                {session.status === "authenticated" &&
                  props.user.id !== session.data.user.id && (
                    <Button
                      color="danger"
                      variant="ghost"
                      onPress={() => setShowUserDeletionDialog(true)}
                    >
                      Delete Account
                    </Button>
                  )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  variant="light"
                  onPress={() => router.push(`/profile/${props.user.id}`)}
                >
                  Edit Profile
                </Button>
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

      <DeleteUserConfirmationDialog
        user={props.user}
        isOpen={showUserDeletionDialog}
        onOpenChange={() => setShowUserDeletionDialog(false)}
        closeParentModal={() => props.closeModal()}
      />
    </>
  );
}

function DeleteUserConfirmationDialog(props: {
  user: User;
  isOpen: boolean;
  onOpenChange: () => void;
  closeParentModal: () => void;
}) {
  const ctx = api.useUtils();

  const { mutate: deleteUser } = api.users.delete.useMutation({
    onSuccess: () => {
      toast.success("Successfully deleted user");
      void ctx.users.invalidate();
      props.closeParentModal();
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  const registeredTime = dayjs(props.user.registered);

  return (
    <Modal isOpen={props.isOpen} onOpenChange={() => props.onOpenChange()}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Are you sure?
              <small className="text-default-500">{`${props.user.name}`}</small>
              <small className="text-default-500">{`${props.user.email}`}</small>
              <Tooltip content={registeredTime.format("DD/MM/YYYY HH:mm")}>
                <small className="text-default-500">{`Registered on ${registeredTime}`}</small>
              </Tooltip>
            </ModalHeader>
            <ModalBody>
              <p>
                This action will permanently delete the user &apos;
                {props.user.name}&apos;
              </p>
              <p>
                All blogs, events, job postings etc. created by this user will
                not be deleted, but the &apos;creator&apos; field will may
                appear empty.
              </p>
              <p>
                The user will also be removed from the &apos;Our Team&apos; page
                if they are active in any years.
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
  );
}

function retiredToLabel(retired: boolean): string {
  return retired ? "Yes" : "No";
}
