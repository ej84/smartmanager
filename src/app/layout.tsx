import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartManager - Subscription Management Tool",
  description:
    "Manage all your SaaS subscriptions in one place. Track payments, analyze spending, and save money.",
  keywords: ["subscription manager", "subscription tracker", "SaaS management"],
  openGraph: {
    title: "SmartManager",
    description: "Track all your subscriptions in one place",
    url: "https://smartmanager-two.vercel.app/",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
