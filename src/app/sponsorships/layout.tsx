import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsors | DataSoc",
  description:
    "DataSoc wouldn't be DataSoc without the amazing companies we've worked with throughout our journey as a society. With more and more data-oriented decisions and predictions made everyday, the demand for talented Data Science graduates is growing.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
