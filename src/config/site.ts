/** Single source of truth for all brand & business details.
 *  Change values here to update the entire site. */

export const siteConfig = {
  // Brand
  brandName: "Lumière",
  tagline: "Handcrafted Scented Candles — Light Up Every Celebration",
  description:
    "Handcrafted scented candles infused with festive warmth and hidden surprises. Made with love in India, delivered across the country.",
  url: "https://lumiere-candles.in",

  // Business (required for Indian e-commerce)
  business: {
    legalName: "Lumière Candles LLP",
    gstNumber: "19XXXXXXXXXXXZX", // Replace with real GST
    pan: "XXXXXXXXXX",
    address: "42, Park Street, Kolkata, West Bengal 700016",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700016",
    country: "India",
  },

  // Contact
  contact: {
    email: "hello@lumiere-candles.in",
    instagram: "https://instagram.com/lumierecandles",
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

  // SEO defaults
  seo: {
    titleTemplate: "%s | Lumière Candles",
    defaultTitle: "Lumière — Handcrafted Scented Candles | Diwali Gifts India",
    defaultDescription:
      "Discover handcrafted scented candles with hidden surprise gifts inside! Jar candles, pillar candles, gift sets, and Diwali hampers. Free delivery across India above ₹799.",
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "Lumière Candles",
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
