import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Reset | DataSoc",
  description: "Reset your password.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
