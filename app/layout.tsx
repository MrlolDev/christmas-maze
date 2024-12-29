import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import SessionProvider from "./providers/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleAnalytics } from "@next/third-parties/google";

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
  description:
    "A festive maze game where players navigate through Christmas-themed challenges to reach the end goal. Complete three increasingly difficult mazes to achieve the highest score!",
  keywords: [
    "Christmas game",
    "maze game",
    "puzzle game",
    "holiday game",
    "browser game",
    "Next.js game",
  ],
  authors: [{ name: "Leo" }],
  creator: "Leo",
  publisher: "Leo",
  openGraph: {
    title: "Christmas Maze",
    description:
      "Navigate through festive mazes in this Christmas-themed puzzle game",
    type: "website",
    siteName: "Christmas Maze",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christmas Maze",
    description:
      "Navigate through festive mazes in this Christmas-themed puzzle game",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#5e0d0c",
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
      <GoogleAnalytics gaId="G-9MLWB9MJ0M" />
    </html>
  );
}
