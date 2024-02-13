import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Tech | DataSoc",
  description:
    "Learn about DataSoc's tech stack and how we build our projects.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
