import "./globals.css";
import "./markdown.css";
import { Inter } from "next/font/google";

import { Toaster } from "react-hot-toast";

import Navbar from "./navbar";
import Footer from "./footer";
import { Providers } from "./providers";
import { ServerProviders } from "./serverProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UNSW DataSoc",
  description: "Official website of the Data Science Society of UNSW",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ServerProviders>
          <Providers>
            <Toaster />
            <Navbar />
            <div className="flex h-screen flex-col justify-between">
              {children}
              {<Footer />}
            </div>
          </Providers>
        </ServerProviders>
      </body>
    </html>
  );
}
