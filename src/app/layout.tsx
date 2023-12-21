import { Inter } from "next/font/google";

import Footer from "./footer";
import "./globals.css";
import "./markdown.css";
import Navbar from "./navbar";
import { Providers } from "./providers";
import { ServerProviders } from "./serverProviders";

import { Toaster } from "react-hot-toast";

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
      <body className={`${inter.className} overscroll-y-none`}>
        <ServerProviders>
          <Providers>
            <Toaster />
            <div className="flex h-screen flex-col justify-between">
              <Navbar />
              {children}
              {<Footer />}
            </div>
          </Providers>
        </ServerProviders>
      </body>
    </html>
  );
}
