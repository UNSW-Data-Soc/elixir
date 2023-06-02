"use client";

import { useSession, logout } from "./auth";

const Navbar = () => {
  const session = useSession();

  return (
    <nav className="w-full fixed z-10 bg-transparent p-5 text-black">
      {!!session && <button onClick={() => logout(session)}>Logout</button>}
    </nav>
  );
};

export default Navbar;
