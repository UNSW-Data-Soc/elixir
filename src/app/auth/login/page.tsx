import Image from "next/image";
import { redirect, useSearchParams } from "next/navigation";

import LoginForm from "./loginForm";

import { getServerSession } from "next-auth";

export default async function Login({
  searchParams,
}: {
  searchParams?: { from?: string };
}) {
  const session = await getServerSession();
  if (session) return redirect(searchParams?.from ?? "/");

  return (
    <main className="fixed flex h-full w-full items-center justify-center bg-white p-5">
      <div className="flex w-10/12 max-w-4xl flex-col overflow-hidden rounded-2xl text-[#333] sm:w-8/12 sm:shadow-2xl md:w-10/12 md:flex-row lg:w-8/12 xl:w-7/12">
        <div className="bg-light-rainbow hidden select-none flex-col items-center justify-center py-10 sm:flex md:w-6/12 md:p-0">
          <Image
            src="/logo_greyscale.jpeg"
            width={100}
            height={100}
            alt="logo"
            className="mb-3 mix-blend-multiply"
            quality={100}
            priority
          />
          <p className="text-[#4a4a4a]">Welcome to</p>
          <p className="text-center text-3xl font-semibold text-[#4a4a4a]">
            UNSW DataSoc
          </p>
        </div>
        <div className="flex flex-col gap-7 p-6 sm:p-12 md:w-6/12">
          <Image
            src="/logo.png"
            width={6450}
            height={1756}
            alt="logo"
            className="block border-b pb-7 sm:hidden"
          />
          <div>
            <h1 className="mb-3 text-2xl font-bold">Login</h1>
            <LoginForm redirectOnLogin={searchParams?.from ?? "/"} />
          </div>
        </div>
      </div>
    </main>
  );
}
