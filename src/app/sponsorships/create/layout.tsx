import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add a sponsor | DataSoc",
  description: "Add a sponsor to the website.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
