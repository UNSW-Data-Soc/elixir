import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add a company | DataSoc",
  description:
    "Add a company to the list of companies that DataSoc has partnered with.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
