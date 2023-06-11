"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { logout } from "./api/auth/[...nextauth]/auth";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const router = useRouter();
  const session = useSession();

  const logoutClick = async () => {
    if (!session) {
      return;
    }
    const success = await logout();
    if (success) {
      router.push("/");
    }
  };

  return (
    <nav className="w-full fixed z-50 text-black shadow-xl  transition-all bg-white flex flex-row justify-between">
      <div>
        <Link href="/" className="">
          <button className="hover:bg-[#ddd] p-5 transition-all">Home</button>
        </Link>
      </div>
      <div className="flex flex-row">
        {session.status === "unauthenticated" && (
          <>
            <Link href="/login" className="">
              <button className="hover:bg-[#ddd] p-5 transition-all">
                Login
              </button>
            </Link>
            <Link href="/register" className="">
              <button className="hover:bg-[#ddd] p-5 transition-all">
                Register
              </button>
            </Link>
          </>
        )}
        {session.status === "authenticated" && (
          <>
            <p className="p-5 ">
              Logged in as{" "}
              <span className="text-[#555] italic">
                {session.data?.user?.email}
              </span>
            </p>
            <button
              className="hover:bg-[#ddd] p-5 transition-all"
              onClick={logoutClick}
            >
              <span>Logout</span>
              {/* <ArrowRightOnRectangleIcon /> */}
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
