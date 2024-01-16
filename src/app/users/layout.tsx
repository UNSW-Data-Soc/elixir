import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users | DataSoc",
  description: "Manage website users.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
