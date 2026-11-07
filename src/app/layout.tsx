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
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.defaultDescription,
  keywords: [
    "scented candles",
    "surprise inside candles",
    "soy wax candles",
    "luxury candles india",
    "artisanal candles",
  ],
  authors: [{ name: siteConfig.brandName }],
  creator: siteConfig.brandName,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    siteName: siteConfig.brandName,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.brandName} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brandName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.png`,
    description: siteConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: `${siteConfig.url}/contact`,
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-[#1A0F0A] text-[#F8EFE6] font-body selection:bg-[#F28A3D]/30 selection:text-[#F8EFE6] pb-16 md:pb-0 antialiased"
      >
        <AuthProvider>
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
        </AuthProvider>
      </body>
    </html>
  );
}
