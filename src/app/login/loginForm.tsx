"use client";

import { FormEventHandler, useState } from "react";
import toast from "react-hot-toast";

import { login } from "../api/auth/[...nextauth]/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { signIn } from "next-auth/react";

const LoginForm = () => {
  const router = useRouter();

  // const session = useSession();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    toast.dismiss();

    signIn("credentials", { email, password });

    // if (await login({ email, password })) {
    //   router.push("/");
    // }
  };

  return (
    <form onSubmit={submitHandler} noValidate>
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
        New here?{" "}
        <Link href="/register" className="text-[#3b7bca] underline">
          Register
        </Link>{" "}
        to create a new account.
      </p>
      <input
        className="py-2 px-4 bg-[#f0f0f0] mt-3 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
        type="submit"
        value="Login"
      />
    </form>
  );
};

const InputLabel = ({ text }: { text: string }) => {
  return <p className="text-[#555]">{text}</p>;
};

export default LoginForm;
