import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backend Docs | DataSoc",
  description: "Documentation for the DataSoc elixir backend.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
