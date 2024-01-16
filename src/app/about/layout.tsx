import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | DataSoc",
  description:
    "Learn about the society that continually seeks the best for students.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
