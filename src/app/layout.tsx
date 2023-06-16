import "./globals.css";
import { Inter } from "next/font/google";

import { Toaster } from "react-hot-toast";

import Navbar from "./navbar";
import SessionProvider from "./NextAuthSession";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UNSW DataSoc",
  description: "Official website of the Data Science Society of UNSW",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Toaster />
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
