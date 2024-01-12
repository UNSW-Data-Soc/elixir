"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

import { FormEventHandler, useEffect, useState } from "react";

import { api } from "@/trpc/react";

import toast, { useToasterStore } from "react-hot-toast";
import isEmail from "validator/lib/isEmail";

const RegisterForm = () => {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { toasts } = useToasterStore();
  // set toast limit to 3
  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= 3) // Is toast index over limit?
      .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
  }, [toasts]);

  const { mutate: registerMutate, isLoading: isRegistering } =
    api.auth.register.useMutation({
      onSuccess: async () => {
        setName("");
        setEmail("");
        setPassword("");
        // toast.remove(TOAST_ID_REGISTER);
        toast.success("Register successful!");

        const signInResponse = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (!signInResponse) {
          toast.error("Sign in error.");
          return;
        } else if (signInResponse.error) {
          toast.error(signInResponse.error);
          return;
        }

        router.push("/");
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0]);
        } else if (e.message) {
          toast.error(e.message);
        } else {
          toast.error("Failed to register! Please try again later.");
        }
      },
    });

  const register: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // TODO: replace with react-form or zod or something
    if (name.length === 0) {
      toast.error("Please enter your name.");
      return;
    }
    if (!isEmail(email)) {
      toast.error("Invalid email.");
      return;
    }
    if (password.length < 8) {
      toast.error("Make sure your password is 8 or more characters.");
      return;
    }

    registerMutate({ name, email, password });
  };

  return (
    <form onSubmit={register} noValidate>
      <div className="flex flex-col gap-2 pb-3">
        <InputLabel text="Name" />
        <input
          className="rounded-xl border-2 px-4 py-3 outline-none transition-all focus:border-[#aaa]"
          type="text"
          placeholder="enter your name..."
          onChange={(e) => setName(e.target.value)}
          value={name}
          disabled={isRegistering}
        />
      </div>
      <div className="flex flex-col gap-2 pb-3">
        <InputLabel text="Email" />
        <input
          formNoValidate
          className="rounded-xl border-2 px-4 py-3 outline-none transition-all focus:border-[#aaa]"
          type="email"
          placeholder="enter your email..."
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          disabled={isRegistering}
        />
      </div>
      <div className="flex flex-col gap-2 pb-3">
        <InputLabel text="Password" />
        <input
          className="rounded-xl border-2 px-4 py-3 outline-none transition-all focus:border-[#aaa]"
          type="password"
          placeholder="enter your password..."
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          disabled={isRegistering}
        />
      </div>
      <p className="text-[#6a6a6a]">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[#3b7bca] underline">
          Login
        </Link>{" "}
        to proceed.
      </p>
      <input
        className="mt-3 rounded-xl border-2 bg-[#f0f0f0] px-4 py-2 transition-all hover:border-blue-300 hover:bg-[#ddd]"
        type="submit"
        value="Register"
      />
    </form>
  );
};

const InputLabel = ({ text }: { text: string }) => {
  return <p className="text-[#555]">{text}</p>;
};

export default RegisterForm;
