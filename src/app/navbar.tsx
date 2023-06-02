"use client";

import { useRouter } from "next/navigation";
import { useSession, logout } from "./auth";

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
    <nav className="w-full fixed z-50 bg-transparent p-5 text-black">
      {!!session && <button onClick={logoutClick}>Logout</button>}
    </nav>
  );
};

export default Navbar;
