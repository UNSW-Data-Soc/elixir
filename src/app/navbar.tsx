"use client";

import { useRouter } from "next/navigation";
import { useSession, logout } from "./auth";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();
  const session = useSession();

  const logoutClick = async () => {
    if (!session) {
      return;
    }
    const success = await logout(session);
    if (success) {
      router.push("/");
    }
  };

  return (
    <nav className="w-full fixed z-50 text-black shadow-xl  transition-all bg-white flex flex-row">
      <Link href="/" className="">
        <button className="hover:bg-[#ddd] p-5 transition-all">Home</button>
      </Link>
      {!session && (
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
      {!!session && (
        <button
          className="hover:bg-[#ddd] p-5 transition-all"
          onClick={logoutClick}
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
