import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers Guide | DataSoc",
  description: "DataSoc's official careers guide.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
