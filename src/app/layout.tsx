import type { Metadata } from "next";
import { Bodoni_Moda, Geist, Geist_Mono } from "next/font/google";
import { brand } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : new URL("https://yuumi-art.rs");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: brand.name,
  title: `${brand.name} | Makeup Artist Adriana — Lebane`,
  description:
    "Yuumi Art je makeup studio Adriane iz Lebana. Profesionalno šminkanje uz individualan pristup i fokus na prirodan, elegantan izgled.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "sr_RS",
    url: "/",
    siteName: brand.name,
    title: `${brand.name} | Makeup Artist Adriana — Lebane`,
    description:
      "Yuumi Art je makeup studio Adriane iz Lebana. Profesionalno šminkanje uz individualan pristup i fokus na prirodan, elegantan izgled.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Yuumi Art - Adriana Makeup Artist, Lebane" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} | Makeup Artist Adriana — Lebane`,
    description:
      "Profesionalno šminkanje i edukacije Adriane iz Lebana.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sr"
      className={`${geistSans.variable} ${geistMono.variable} ${bodoni.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
