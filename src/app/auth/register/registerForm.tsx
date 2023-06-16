"use client";

import Link from "next/link";
import { FormEventHandler, useEffect, useState } from "react";
import toast, { useToasterStore } from "react-hot-toast";
import isEmail from "validator/lib/isEmail";
import { useRouter } from "next/navigation";
import { authRegister } from "../../api/auth/[...nextauth]/auth";
import { signIn } from "next-auth/react";

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

    const res = await authRegister({ name, password, email });
    if (res.error) {
      toast.error(res.error);
      return;
    }

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
  };

  return (
    <form onSubmit={register} noValidate>
      <div className="flex flex-col gap-2 pb-3">
        <InputLabel text="Name" />
        <input
          className="py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none"
          type="text"
          placeholder="enter your name..."
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>
      <div className="flex flex-col gap-2 pb-3">
        <InputLabel text="Email" />
        <input
          formNoValidate
          className="py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none"
          type="email"
          placeholder="enter your email..."
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div className="flex flex-col gap-2 pb-3">
        <InputLabel text="Password" />
        <input
          className="py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none"
          type="password"
          placeholder="enter your password..."
          onChange={(e) => setPassword(e.target.value)}
          value={password}
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
        className="py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
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
