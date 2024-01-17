import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Companies | DataSoc",
  description: "Companies that DataSoc has partnered with.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
