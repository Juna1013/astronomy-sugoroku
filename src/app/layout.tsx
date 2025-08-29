import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import SpaceBackground from "@/components/SpaceBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "宇宙すごろく - Space Sugoroku",
  description: "宇宙を冒険するすごろくゲーム",
  openGraph: {
    title: "宇宙すごろく - Space Sugoroku",
    description: "宇宙を冒険するすごろくゲーム",
    url: "https://astronomy-sugoroku.vercel.app",
    siteName: "宇宙すごろく - Space Sugoroku",
    images: [
      {
        url: "https://your-app.vercel.app/og-image.png", // ←public/og-image.png を置く
        width: 1200,
        height: 630,
        alt: "宇宙すごろくのサムネイル",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "宇宙すごろく - Space Sugoroku",
    description: "宇宙を冒険するすごろくゲーム",
    images: ["https://astronomy.vercel.app/og-image.png"], // 同じく差し替え
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="space-nebula" />
          <div className="star-layer small" />
          <div className="star-layer mid" />
          <div className="star-layer big" />
          <SpaceBackground />
          <div className="app-content relative z-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
