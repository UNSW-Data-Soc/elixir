import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a resource | DataSoc",
  description: "Create a new resource on the website.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
