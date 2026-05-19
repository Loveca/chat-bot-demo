import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat Demo",
  description: "Claude-style chat UI powered by DeepSeek",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
