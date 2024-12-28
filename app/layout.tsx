import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import SessionProvider from "./providers/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Christmas Maze",
  description: "Christmas Maze",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[url('/background.webp')] bg-cover bg-start bg-no-repeat justify-center items-center`}
      >
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
