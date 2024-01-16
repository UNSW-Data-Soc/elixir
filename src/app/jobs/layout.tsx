import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs Board | DataSoc",
  description:
    "Are you interested in gaining real-world experience to apply knowledge learnt in your degree and fast forward your career? Keep an eye out for internship and graduate opportunities that are constantly updated on this page!",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
