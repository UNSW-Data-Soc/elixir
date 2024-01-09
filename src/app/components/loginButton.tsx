"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut, useSession } from "next-auth/react";

import { ELIXIR_FEEDBACK_LINK } from "../utils";

export default function LoginButton() {
  const pathname = usePathname();
  const session = useSession();

  return session.status === "authenticated" ? (
    <>
      <Link href="" onClick={() => signOut()}>
        Logout
      </Link>
      <Link target="_blank" href={ELIXIR_FEEDBACK_LINK}>
        Feedback
      </Link>
      <Link href="/docs">Backend Docs</Link>
    </>
  ) : (
    <Link href={`/auth/login?from=${pathname}`}>Login</Link>
  );
}
