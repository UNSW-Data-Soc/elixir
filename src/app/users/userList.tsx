"use client";

import { CSSProperties, useState } from "react";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import { Spinner } from "@/app/utils";
import { getUserProfilePicRoute } from "@/app/utils/s3";

import AvatarIcon from "../utils/avatarIcon";
import UserDialogueInfo from "./userPermissionsDialog";

type User = RouterOutputs["users"]["getAll"][number];

export default function UsersList() {
  const { data: users, isLoading, isError } = api.users.getAll.useQuery();

  const [showModalUser, setShowModalUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorText error={"Failed to get users"} />;

  return (
    <div className="container m-auto flex flex-wrap justify-center gap-5 p-10">
      {users.map((user) => (
        <Card
          key={user.id}
          style={getUserCardStyle(user)}
          isBlurred
          isPressable
          radius="lg"
          className="border-none"
          onPress={() => {
            setShowModal(true);
            setShowModalUser(user);
          }}
        >
          <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
            <small className="text-default-500">{}</small>
            <h4 className="text-large font-bold">{user.name}</h4>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            {user.image ? (
              <Image
                src={getUserProfilePicRoute(user.id, user.image)}
                alt="Profile picture"
                className="rounded-xl object-cover"
                height={300}
                width={300}
              />
            ) : (
              <AvatarIcon />
            )}
          </CardBody>
        </Card>
      ))}
      {showModal && showModalUser && (
        <UserDialogueInfo
          isModalOpen={showModal}
          user={{ ...showModalUser }}
          closeModal={() => {
            setShowModal(false);
            setShowModalUser(null);
          }}
        />
      )}
    </div>
  );
}

function getUserCardStyle(user: User): CSSProperties {
  return {
    backgroundColor:
      user.role === "moderator"
        ? "salmon"
        : user.role === "admin"
        ? "#B4E4FF"
        : "#DDFFBB",
    opacity: user.retired === null || user.retired ? 0.6 : 1,
  };
}

function ErrorText({ error }: { error: string }) {
  return (
    <p className="container m-auto flex flex-wrap justify-center gap-5 p-10">
      {error}
    </p>
  );
}
