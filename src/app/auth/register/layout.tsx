import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | DataSoc",
  description: "Create a new account at DataSoc.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
