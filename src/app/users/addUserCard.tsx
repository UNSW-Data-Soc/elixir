"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { useEffect, useState } from "react";

import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";

import { api } from "@/trpc/react";

import AddCard from "../components/AddCard";
import { isModerator } from "../utils";

import toast from "react-hot-toast";

export default function UserAddCard() {
  const session = useSession();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  if (!isModerator(session.data)) {
    return <></>;
  }

  return (
    <>
      <AddCard onPress={() => onOpen()} />
      <UserAddModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}

function UserAddModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const ctx = api.useUtils();

  const { mutate: addUser } = api.auth.register.useMutation({
    onSuccess: () => {
      toast.success("Added user");

      setName("");
      setEmail("");
      setPassword("");
      void ctx.users.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const addUserSubmit = () => {
    if (name.length === 0) {
      toast.error("Please enter a name");
      return false;
    }

    if (email.length === 0) {
      toast.error("Please enter an email");
      return false;
    }

    if (password.length === 0) {
      toast.error("Please enter a password");
      return false;
    }

    addUser({
      name,
      email,
      password,
    });

    return true;
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <form
              className="flex flex-col gap-3 p-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (addUserSubmit()) onClose();
              }}
            >
              <h2 className="text-xl font-semibold">Add a new user</h2>
              <div className="flex flex-col gap-1">
                <p>Name</p>
                <input
                  className="rounded-md bg-[#f5f5f5] px-3 py-2 outline-none transition-all focus:bg-[#f0f0f0]"
                  type="text"
                  name="name"
                  placeholder="John Smith"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p>Email</p>
                <input
                  className="rounded-md bg-[#f5f5f5] px-3 py-2 outline-none transition-all focus:bg-[#f0f0f0]"
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p>Password</p>
                <input
                  className="rounded-md bg-[#f5f5f5] px-3 py-2 outline-none transition-all focus:bg-[#eee]"
                  type="password"
                  name="password"
                  placeholder="abc12345"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              <input
                type="submit"
                value="Submit"
                className="cursor-pointer rounded-md bg-[#f5f5f5] px-3 py-2 transition-all hover:bg-[#eee]"
              />
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
