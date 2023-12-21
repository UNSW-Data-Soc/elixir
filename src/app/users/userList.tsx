"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { CSSProperties, useState } from "react";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import { Spinner } from "@/app/utils";
import { getUserProfilePicRoute } from "@/app/utils/s3";

import UserDialogueInfo from "./userPermissionsDialog";

import toast from "react-hot-toast";

type User = RouterOutputs["users"]["getAll"][number];

export default function UsersList() {
  const router = useRouter();
  const session = useSession();

  const { data: users, isLoading, isError } = api.users.getAll.useQuery();

  const [showModalUser, setShowModalUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (session.status == "loading" || isLoading) return <Spinner />;
  if (
    session.status === "unauthenticated" ||
    session.data?.user.role !== "admin"
  ) {
    router.push("/");
    return <></>;
  }

  if (isError) {
    toast.error("Failed to get users.");
    return <></>;
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

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="container m-auto flex gap-5 p-10 flex-wrap justify-center">
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
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <small className="text-default-500">{}</small>
                <h4 className="font-bold text-large">{user.name}</h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <Image
                  src={
                    user.image
                      ? getUserProfilePicRoute(user.id, user.image)
                      : "./logo.png"
                  } // TODO: default user profile picture
                  alt="Profile picture"
                  className="object-cover rounded-xl"
                  height={300}
                  width={300}
                />
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
      )}
    </>
  );
}
