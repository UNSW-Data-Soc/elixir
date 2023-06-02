"use client";

import { FormEventHandler, useState } from "react";
import toast from "react-hot-toast";
import isEmail from "validator/lib/isEmail";

const RegisterForm = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const register: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    toast.dismiss();

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

    try {
      const res = await fetch("http://127.0.0.1:8000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      toast.success("Registered successfully!");
      console.log(await res.json());
    } catch (error) {
      toast.error(JSON.parse((error as any).message).detail);
    }
  };

  return (
    <form onSubmit={register}>
      <div className="flex flex-col gap-2 py-3">
        <InputLabel text="Name" />
        <input
          className="py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none"
          type="text"
          placeholder="enter your name..."
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>
      <div className="flex flex-col gap-2 py-3">
        <InputLabel text="Email" />
        <input
          className="py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none"
          type="email"
          placeholder="enter your email..."
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div className="flex flex-col gap-2 py-3">
        <InputLabel text="Password" />
        <input
          className="py-3 px-4 border-2 rounded-xl transition-all focus:border-[#aaa] outline-none"
          type="password"
          placeholder="enter your password..."
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
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
