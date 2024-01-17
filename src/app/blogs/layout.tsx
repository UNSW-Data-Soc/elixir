import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs | DataSoc",
  description:
    "Stay in the loop with our blog posts! From educational guides to opinion articles about data science in the real world, they're here for you!",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
