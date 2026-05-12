import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { getAplusBootstrapScript } from "@/lib/umeng";

export const metadata: Metadata = {
  title: "金豆芽 × 淘宝 AI 购物",
  description: "金豆芽官方活动中转页",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <Script id="umeng-aplus-bootstrap" strategy="beforeInteractive">
          {getAplusBootstrapScript()}
        </Script>
        {children}
      </body>
    </html>
  );
}
