"use client";

import { useRouter } from "next/navigation";

import { FormEventHandler, useEffect, useState } from "react";

import { api } from "@/trpc/react";

import toast, { useToasterStore } from "react-hot-toast";

export default function NewPasswordForm(props: { token: string }) {
  const router = useRouter();

  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  const { mutate: resetPassword } = api.auth.resetPassword.useMutation({
    onSuccess: () => {
      toast.success("Password changed successfully.");
      router.push("/auth/login");
    },
    onError: () => {
      toast.error("Failed to reset password.");
    },
  });

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
    if (password === "") {
      return toast.error("Please enter a valid password!");
    } else if (password !== passwordConfirmation) {
      return toast.error("Passwords don't match!");
    }

    resetPassword({ password, token: props.token });
  };

  return (
    <div>
      <div>
        <form onSubmit={submitHandler} noValidate>
          <div className="flex flex-col gap-2 pb-3">
            <input
              formNoValidate
              className="rounded-xl border-2 px-4 py-3 outline-none transition-all focus:border-[#aaa]"
              type="password"
              placeholder="enter a new password..."
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="flex flex-col gap-2 pb-3">
            <input
              formNoValidate
              className="rounded-xl border-2 px-4 py-3 outline-none transition-all focus:border-[#aaa]"
              type="password"
              placeholder="re-enter the password..."
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              value={passwordConfirmation}
            />
          </div>
          <input
            className="mt-12 rounded-xl border-2 bg-[#f0f0f0] px-4 py-2 transition-all hover:border-blue-300 hover:bg-[#ddd]"
            type="submit"
            value="Save"
          />
        </form>
      </div>
    </div>
  );
}
