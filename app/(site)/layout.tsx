import type { Metadata, Viewport } from "next";
import { Inter, Anton } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { content } from "@/lib/content";
import "./globals.css";

// Self-hosted at build time by next/font: no request to Google at runtime, no layout shift.
const inter = Inter({ variable: "--next-font-inter", subsets: ["latin"], display: "swap" });
const anton = Anton({ variable: "--next-font-anton", subsets: ["latin"], weight: "400", display: "swap" });

const { site } = content;
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: site.seoTitle,
  description: site.seoDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.organizationName,
    title: site.seoTitle,
    description: site.seoDescription,
    locale: "en_US",
    // og:image comes from app/(site)/opengraph-image.png (file convention).
  },
  twitter: { card: "summary_large_image", title: site.seoTitle, description: site.seoDescription },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable}`}>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body className="min-h-screen bg-white font-sans text-black antialiased selection:bg-brand selection:text-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-black focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
