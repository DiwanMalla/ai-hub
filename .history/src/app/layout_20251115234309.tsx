import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Model Collections | Hugging Face Explorer",
  description:
    "Curate, document, and try AI models such as briaai/RMBG-1.4 directly from a Next.js showcase.",
  openGraph: {
    title: "AI Model Collections",
    description:
      "Hands-on playground for Hugging Face models with background removal demo.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Model Collections",
    description: "Launch pad for testing Hugging Face models inside Next.js.",
  },
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
        {children}
      </body>
    </html>
  );
}
