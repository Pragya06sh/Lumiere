import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.defaultDescription,
  keywords: [
    "scented candles",
    "diwali candles",
    "surprise inside candles",
    "kolkata candles",
    "diwali hampers kolkata",
    "soy wax candles",
    "luxury candles india",
    "artisanal candles",
  ],
  authors: [{ name: siteConfig.brandName }],
  creator: siteConfig.brandName,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    siteName: siteConfig.brandName,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-[#1A0F0A] text-[#F8EFE6] font-body selection:bg-[#F28A3D]/30 selection:text-[#F8EFE6] pb-16 md:pb-0 antialiased"
      >
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#FFFFFF",
              color: "#3A2A22",
              border: "1px solid rgba(184, 137, 60, 0.3)",
              borderRadius: "14px",
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              boxShadow: "0 8px 24px rgba(58, 42, 34, 0.08)",
            },
          }}
        />
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileNav />
        <CartDrawer />
        <WhatsAppButton />
        <CookieConsent />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
