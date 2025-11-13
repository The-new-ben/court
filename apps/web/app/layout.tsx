import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Catalog Platform",
  description: "Dynamic AI-driven catalog platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
