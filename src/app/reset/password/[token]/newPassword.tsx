
"use client";

import { FormEventHandler, useEffect, useState } from "react";
import toast, { useToasterStore } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { endpoints } from "@/app/api/backend/endpoints";

export default function NewPasswordForm(props: {token: string}) {
    const router = useRouter();

    const [password, setPassword] = useState<string>("");
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

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
        } else if(password !== passwordConfirmation) {
            return toast.error("Passwords don't match!");
        }

        endpoints.auth.resetPasswordFromToken(props.token, password)
            .then(() => {
                toast.success("Password changed successfully.");
                router.push("/auth/login")
            })
            .catch(() => {
                toast.error("Failed to reset password.")
            })
    };

    return (
        <div>
            <div>
                <form onSubmit={submitHandler} noValidate>
                    <div className="flex flex-col gap-2 pb-3">
                        <input
                            formNoValidate
                            className="py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none"
                            type="password"
                            placeholder="enter a new password..."
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </div>
                    <div className="flex flex-col gap-2 pb-3">
                        <input
                            formNoValidate
                            className="py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none"
                            type="password"
                            placeholder="re-enter the password..."
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            value={passwordConfirmation}
                        />
                    </div>
                    <input
                        className="py-2 px-4 bg-[#f0f0f0] mt-12 rounded-xl hover:bg-[#ddd] border-2 hover:border-blue-300 transition-all"
                        type="submit"
                        value="Save"
                    />
                </form>
            </div>
        </div>
    );
}
