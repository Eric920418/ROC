import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

// 配置 Montserrat 字体（用于英文）
const montserrat = localFont({
  src: [
    {
      path: "../public/Montserrat,Noto_Sans_TC/Montserrat/Montserrat-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../public/Montserrat,Noto_Sans_TC/Montserrat/Montserrat-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-montserrat",
  display: "swap",
});

// 配置 Noto Sans TC 字体（用于中文）
const notoSansTC = localFont({
  src: "../public/Noto_Sans_TC 2/NotoSansTC-VariableFont_wght.ttf",
  variable: "--font-noto-sans-tc",
  display: "swap",
});

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
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
        <style>{`
          .material-icons-outlined {
            font-size: inherit;
          }
        `}</style>
      </head>
      <body
        className={`${montserrat.variable} ${notoSansTC.variable} min-h-screen bg-white text-slate-900`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
