import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shield & Scatter — Data portrait",
  description:
    "Interactive data-driven artwork from public Threads captures on a Taiwan juvenile-violence case.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
