import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinanceFlow - Personal Finance Dashboard",
  description: "A modern personal finance dashboard built with React, TypeScript, and Redux. Features currency conversion, stock watchlist, and expense tracking.",
  keywords: ["finance", "dashboard", "react", "typescript", "redux", "currency", "stocks", "expenses"],
  authors: [{ name: "Tom Ferrari" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
