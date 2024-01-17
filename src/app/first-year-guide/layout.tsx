import { Metadata } from "next";

export const metadata: Metadata = {
  title: "First Year Guide | DataSoc",
  description: "DataSoc's official first year guide.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
