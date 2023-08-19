"use client";

import { FormEventHandler, useEffect, useState } from "react";
import toast, { useToasterStore } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { endpoints } from "@/app/api/backend/endpoints";

export default function ResetForm() {
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [linkSent, setLinkSent] = useState(false);

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
        try {
            endpoints.auth.resetPasswordRequest(email);
        } catch {
        } finally {
            // don't leak information about account existence
            setLinkSent(true);
            toast.success("Please check your email for a reset link.");
        }
    };

    return (
        <div>
            {linkSent ? (
                <div>Please check your email for the reset link.</div>
            ) : (
                <div>
                    <p className=" text-xs italic mb-3"> Enter the email address associated with your account to recieve a reset link.</p>
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
                        <input
                            className="py-2 px-4 bg-[#f0f0f0] mt-12 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
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
