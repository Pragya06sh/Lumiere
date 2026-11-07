/** Single source of truth for all brand & business details.
 *  Change values here to update the entire site. */

export const siteConfig = {
  // Brand
  brandName: "Wick & Wish",
  brandSlug: "wick-and-wish",
  domain: "wickandwish.in",
  tagline: "Light a candle. Reveal a wish.",
  description:
    "Handcrafted scented candles infused with tranquil warmth and sealed keepsake surprises.",
  url: "https://wickandwish.in",

  // Business
  business: {
    legalName: "Wick & Wish",
    address: "Kolkata, West Bengal, India",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
  },

  // Contact
  contact: {
    instagram: "https://instagram.com/wickandwish",
    instagramHandle: "@wickandwish",
  },

  // Payment
  payment: {
    upiId: "ps333mahi@okhdfcbank",
    razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    currency: "INR",
    currencySymbol: "₹",
  },

  // Shipping
  shipping: {
    freeShippingThreshold: 79900, // paise = ₹799
    standardShippingFee: 4900, // paise = ₹49
    codFee: 3900, // paise = ₹39
    estimatedDeliveryDays: { min: 3, max: 7 },
  },

  // Authentication & Verification
  auth: {
    emailVerificationEnabled: false, // Default false until domain is verified in Resend
  },

  // SEO defaults
  seo: {
    titleTemplate: "%s | Wick & Wish",
    defaultTitle: "Wick & Wish — Handcrafted Scented Candles & Surprise Keepsakes",
    defaultDescription:
      "Discover artisanal scented candles with sealed keepsake treasures inside. Free delivery across India on qualifying orders.",
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "Wick & Wish",
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
