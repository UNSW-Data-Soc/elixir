"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LoginButton() {
  const pathname = usePathname();

  return <Link href={`/auth/login?from=${pathname}`}>Login</Link>;
}
