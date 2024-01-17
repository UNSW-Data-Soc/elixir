import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Cover Photo | DataSoc",
  description: "Update the cover photo on the homepage.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
