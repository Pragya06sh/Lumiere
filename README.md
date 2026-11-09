# WICK & WISH — Handcrafted Scented Candles

A production-ready e-commerce platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**. Specially crafted for an artisanal scented candle brand, blending quiet luxury with hidden surprise keepsakes inside each candle.

---

## Features

- **Storefront & Catalog**: 12 artisanal products with variants (weight/sizes), detailed scent notes (top, middle, base), burn times, wax types, and high-resolution gallery
- **Surprise Inside Candles**: Proprietary hidden keepsake system with sealed heat-safe metal charms and coins revealed as wax burns down
- **Audience Gift Selection**: "Gift for: Her / Him / Anyone" selector with audience-specific inventory tracking
- **Surprise Reveal Verification**: Unique redemption code cards (`/reveal/[code]`) with wax melting reveal animation
- **Cart & Slide-over Drawer**: Zustand-powered persistent cart with free shipping progress bar, luxury gift wrapping with custom note, and instant coupon codes
- **Multi-Method Checkout**: Secure Razorpay gateway (UPI, Cards, Netbanking) and Cash on Delivery (COD)
- **Order Tracking**: Real-time status lookup by Order Number with interactive progress bar
- **Admin Atelier**: Comprehensive dashboard managing paid revenue, order statuses, product catalog & audience stock, reveal redemption codes, and site settings

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Setup database
npx prisma generate
npx prisma db push

# 3. Seed products and data
npm run seed

# 4. Run development server
npm run dev
```

---

## Configuration

Brand information is centralized in [`src/config/site.ts`](file:///c:/Users/ps333/Downloads/Scented_candles_business/src/config/site.ts).
