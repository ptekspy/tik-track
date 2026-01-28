import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TikTrack - TikTok Analytics Tracker",
  description: "Manual TikTok video analytics tracking and performance monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Background gradient */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-[#0f0f23] dark:via-[#1e1b4b] dark:to-[#0f0f23]">
          {/* Animated gradient orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#fe2c55]/20 to-[#7c3aed]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#25f4ee]/20 to-[#4f46e5]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
