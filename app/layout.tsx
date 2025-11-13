import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "R.co - 您的專業平台",
  description: "R.co 提供專業服務與資訊交流平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
