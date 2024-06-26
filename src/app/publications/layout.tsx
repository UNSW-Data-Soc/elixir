import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications | DataSoc",
  description:
    "You can find all of our publications here, including our newsletters and guides!",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
