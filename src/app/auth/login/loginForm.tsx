"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { signIn, useSession } from "next-auth/react";

import { FormEventHandler, useEffect, useState } from "react";

import toast, { useToasterStore } from "react-hot-toast";

const LoginForm = () => {
  const router = useRouter();

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

  const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const signInResponse = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!signInResponse) {
      toast.error("Sign in error.");
      return;
    } else if (signInResponse.error) {
      toast.error("Invalid credentials.");
      return;
    }

    // if login successful redirect to home page
    router.push("/");
  };

  return (
    <form onSubmit={submitHandler} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <InputLabel text="Email" />
        <input
          formNoValidate
          className="rounded-xl border-2 px-4 py-3 outline-none transition-all focus:border-[#aaa]"
          type="email"
          placeholder="z1234567@unsw.edu.au"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div className="flex flex-col gap-2">
        <InputLabel text="Password" />
        <input
          className="rounded-xl border-2 px-4 py-3 outline-none transition-all focus:border-[#aaa]"
          type="password"
          placeholder="********"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <div className="flex justify-between">
        <Link
          href="/reset/password"
          className="text-[#3b7bca] hover:underline hover:text-[#235da4] transition-all"
        >
          Forgot password?
        </Link>
        {/* <span>
          New here?{" "}
          <Link href="/auth/register" className="text-[#3b7bca] underline">
            Register
          </Link>{" "}
          instead.
        </span> */}
      </div>
      <input
        className="rounded-xl border-2 bg-[#f0f0f0] px-4 py-2 transition-all hover:border-blue-300 hover:bg-[#ddd] cursor-pointer"
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
