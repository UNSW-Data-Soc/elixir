"use client";

import { FormEventHandler, useEffect, useState } from "react";

import { api } from "@/trpc/react";

import toast, { useToasterStore } from "react-hot-toast";

export default function ResetForm() {
  const [email, setEmail] = useState<string>("");
  const [linkSent, setLinkSent] = useState(false);

  const { mutate: resetPassword, isLoading: isResetting } =
    api.auth.sendResetToken.useMutation({
      onSuccess: () => {
        setLinkSent(true);
        toast.success("Please check your email for a reset link.");
      },
      onError: () => {
        toast.error(
          "Failed to send reset link. Contact IT if this keeps happening.",
        );
      },
    });

  // toasts
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
    if (email === "") {
      return toast.error("Please enter a valid email!");
    }

    resetPassword({ email });
  };

  return (
    <div>
      {linkSent ? (
        <div>Please check your email for the reset link.</div>
      ) : (
        <div>
          <p className=" mb-3 text-xs italic">
            Enter the email address associated with your account to recieve a
            reset link.
          </p>
          <form onSubmit={submitHandler} noValidate>
            <div className="flex flex-col gap-2 pb-3">
              <InputLabel text="Email" />
              <input
                formNoValidate
                className="rounded-xl border-2 px-4 py-3 outline-none transition-all focus:border-[#aaa]"
                type="email"
                placeholder="enter your email..."
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={isResetting}
              />
            </div>
            <input
              className="mt-12 rounded-xl border-2 bg-[#f0f0f0] px-4 py-2 transition-all hover:border-blue-300 hover:bg-[#ddd]"
              type="submit"
              value="Send reset link"
            />
          </form>
        </div>
      )}
    </div>
  );
}

const InputLabel = ({ text }: { text: string }) => {
  return <p className="text-[#555]">{text}</p>;
};
