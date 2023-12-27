"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSession } from "next-auth/react";

export default function LoginButton() {
  const pathname = usePathname();
  const session = useSession();

  if (session.status === "authenticated") return <></>;

  return <Link href={`/auth/login?from=${pathname}`}>Login</Link>;
}
