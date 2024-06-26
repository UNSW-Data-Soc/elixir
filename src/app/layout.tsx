import { Inter } from "next/font/google";

import Footer from "./footer";
import "./globals.css";
import Navbar from "./navbar";
import { Providers } from "./providers";
import { ServerProviders } from "./serverProviders";

import { Metadata } from "next";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "UNSW DataSoc",
  description:
    "Welcome to the Data Science Society of UNSW! DataSoc aims to become Australia's leading student-run society platform in assisting students on achieving their data science career goals. As the first undergraduate data science society in Australia, we strive to create data science related opportunities for students in their studies and careers, whilst fostering a sense of community and diversity among UNSW data science students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} overscroll-y-none scroll-smooth`}>
        <ServerProviders>
          <Providers>
            <Toaster />
            <div className="flex h-screen flex-col justify-between">
              <Navbar />
              {children}
              <Footer />
            </div>
          </Providers>
        </ServerProviders>
      </body>
    </html>
  );
}
