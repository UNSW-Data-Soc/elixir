"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { logout } from "./api/auth/[...nextauth]/auth";

const Navbar = () => {
  const router = useRouter();
  const session = useSession();

  console.log("SESSION:");
  console.log(session);

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
            <p className="p-5 ">Hello, {session.data?.user?.email}</p>
            <button
              className="hover:bg-[#ddd] p-5 transition-all"
              onClick={logoutClick}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
