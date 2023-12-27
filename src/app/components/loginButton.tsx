"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut, useSession } from "next-auth/react";

const logout = async () => {
  await signOut();
};

export default function LoginButton() {
  const pathname = usePathname();
  const session = useSession();

  if (session.status === "authenticated")
    return (
      <Link href="" onClick={() => signOut()}>
        Logout
      </Link>
    );

  return <Link href={`/auth/login?from=${pathname}`}>Login</Link>;
}
