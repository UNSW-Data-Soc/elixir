import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | DataSoc",
  description: "Login to your DataSoc account.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
