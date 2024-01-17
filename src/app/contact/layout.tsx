import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | DataSoc",
  description:
    "Feel free to reach out to us here if you have any questions or queries!",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
