# 🔥 LUMIÈRE — Handcrafted Scented Candles (Kolkata, India)

A production-ready e-commerce platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**. Specially crafted for an artisanal scented candle brand based in Kolkata, West Bengal, blending rich **Diwali festive warmth** with a **dark, epic superhero comic mood**.

---

## ⚡ Quick Architecture Overview

- **Framework**: Next.js 15 (App Router, Server Components & Route Handlers)
- **Styling**: Tailwind CSS with custom design tokens (gold, maroon, ember, flame, near-black `#0d0a07`)
- **Typography**: Anton (bold condensed display), Cormorant Garamond (accents), DM Sans (clean body)
- **State Management**: Zustand with persistent storage (`lumiere-cart-storage`, `lumiere-wishlist-storage`)
- **Database**: PostgreSQL (Neon / Supabase) with Prisma ORM
- **Payments**: Razorpay (UPI, Debit/Credit Cards, Netbanking) + Direct UPI QR/ID + Cash on Delivery (COD)
- **Local Logistics**: Optimized for **Kolkata, West Bengal** (pincodes 700001–700100) with live delivery estimation and pincode serviceability checks
- **Festive Control**: Toggleable festive mode in [src/config/festive.ts](file:///c:/Users/ps333/Downloads/Scented_candles_business/src/config/festive.ts) to switch off Diwali elements post-season with 1 click

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js 18.x or 20.x or higher
- npm installed

### 2. Installation
```bash
# Clone or navigate into the project directory
cd Scented_candles_business

# Install dependencies
npm install --legacy-peer-deps
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your configuration keys in `.env.local`:
- `DATABASE_URL`: PostgreSQL connection string (Neon or Supabase)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Your Razorpay Key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret
- `NEXTAUTH_SECRET`: Random 32-character string (`openssl rand -base64 32`)

### 4. Database Setup & Seeding
```bash
# Push Prisma schema to your PostgreSQL database
npx prisma db push

# Seed 12 products with variants, categories, Kolkata pincodes, coupons, and sample reviews
npx tsx prisma/seed.ts
```

### 5. Run the Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Run Critical Flow Unit Tests
```bash
npx tsx __tests__/critical-flows.test.ts
```

---

## 🔑 How to Get Each API Key

### 1. Razorpay (Online Payments in India)
1. Go to [dashboard.razorpay.com](https://dashboard.razorpay.com) and create an account.
2. Complete your business KYC with your Indian PAN and Bank Account.
3. In the left sidebar, navigate to **Account & Settings** → **API Keys**.
4. Generate your **Key Id** and **Key Secret**.
5. Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env.local`.
6. For development, use **Test Mode** keys (`rzp_test_...`).

### 2. PostgreSQL Database (Neon or Supabase)
- **Neon (Recommended for Serverless)**:
  1. Go to [neon.tech](https://neon.tech) and sign up for a free tier database.
  2. Create a new project named `lumiere-candles`.
  3. Copy the pooled connection string (`postgresql://...`) and paste it as `DATABASE_URL`.
- **Supabase**:
  1. Go to [supabase.com](https://supabase.com) and create a project.
  2. Navigate to **Project Settings** → **Database** → **Connection String (URI)**.
  3. Set mode to `Transaction (port 6543)` or `Session (port 5432)`.

### 3. Resend (Order Confirmation Emails)
1. Sign up at [resend.com](https://resend.com).
2. Go to **API Keys** and generate an API key.
3. Go to **Domains** and add your custom domain (e.g., `lumiere-candles.in`).
4. Add the provided DNS TXT/MX records to your domain provider.
5. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.

### 4. Cloudinary (Admin Image Uploads)
1. Sign up at [cloudinary.com](https://cloudinary.com).
2. Copy **Cloud Name**, **API Key**, and **API Secret** from your Dashboard.
3. Paste them into `.env.local`.

---

## 🎨 Brand Customization (One-Stop Config)

### Change Brand Name, Contact, GST & Kolkata Address
Open [src/config/site.ts](file:///c:/Users/ps333/Downloads/Scented_candles_business/src/config/site.ts):
```typescript
export const siteConfig = {
  brandName: "Your Brand Name", // Changed across all pages, footer & header
  tagline: "Your Tagline",
  business: {
    legalName: "Your Registered LLP / Pvt Ltd",
    gstNumber: "19XXXXXXXXXXXZX", // Updated on footer and legal policies
    address: "Your Street Address, Kolkata 700016",
  },
  contact: {
    phone: "+91 98300 XXXXX",
    whatsapp: "+9198300XXXXX", // Triggers direct WhatsApp chat
    email: "hello@yourbrand.in",
  },
  payment: {
    upiId: "yourbrand@upi", // Displayed for direct QR / mobile checkout
  },
  shipping: {
    freeShippingThreshold: 99900, // ₹999 in paise
    standardShippingFee: 7900,    // ₹79 in paise
    codFee: 4900,                 // ₹49 in paise
  }
};
```

### Toggle Festive / Diwali Mode Off Post-Season
Open [src/config/festive.ts](file:///c:/Users/ps333/Downloads/Scented_candles_business/src/config/festive.ts):
```typescript
export const festiveConfig = {
  enabled: false, // Set to false to instantly deactivate all Diwali countdowns, hype badges, and ember particles!
};
```

### Replace Product Images
All images are centrally registered in [src/data/products.ts](file:///c:/Users/ps333/Downloads/Scented_candles_business/src/data/products.ts).
Place your product photography in `public/images/products/` or use Cloudinary URLs:
```typescript
images: [
  { url: "/images/products/ember-titan.jpg", alt: "Ember Titan Candle" }
]
```

---

## 🚢 Deploying to Vercel (Step-by-Step)

1. Push your repository to GitHub or GitLab:
   ```bash
   git init
   git add .
   git commit -m "feat: complete scented candle e-commerce store"
   git remote add origin https://github.com/your-username/scented-candles.git
   git push -u origin main
   ```
2. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. In **Environment Variables**, add:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your Vercel production URL or custom domain)
5. Click **Deploy**. Vercel will build the production bundle automatically.
6. Run the seed script against your production Neon/Supabase DB once:
   ```bash
   DATABASE_URL="your_production_neon_url" npx tsx prisma/seed.ts
   ```

---

## 🌐 Connecting a Custom Domain (.in or .com)
1. On your Vercel Project Dashboard, go to **Settings** → **Domains**.
2. Type your registered domain (e.g. `lumierecandles.in`).
3. Add the DNS records shown by Vercel in your domain registrar (GoDaddy, Namecheap, Cloudflare):
   - **A Record**: `@` → `76.76.21.21`
   - **CNAME Record**: `www` → `cname.vercel-dns.com`
4. SSL certificates are provisioned automatically within minutes.

---

## ✅ Pre-Launch Checklist (Must-Do Before Going Live)

- [ ] **Razorpay KYC**: Verify business bank account and switch keys from Test mode (`rzp_test_...`) to Live mode (`rzp_live_...`).
- [ ] **Real UPI ID**: Update `siteConfig.payment.upiId` in [src/config/site.ts](file:///c:/Users/ps333/Downloads/Scented_candles_business/src/config/site.ts) with your official merchant UPI ID.
- [ ] **GST Number**: Insert your official West Bengal GSTIN in [src/config/site.ts](file:///c:/Users/ps333/Downloads/Scented_candles_business/src/config/site.ts).
- [ ] **Test Transaction**: Perform a test purchase using UPI and COD to confirm order notifications and order ID assignment.
- [ ] **WhatsApp Number**: Confirm WhatsApp link connects to your Kolkata customer care phone.
- [ ] **Legal Review**: Read [Privacy Policy](file:///c:/Users/ps333/Downloads/Scented_candles_business/src/app/privacy-policy/page.tsx), [Terms](file:///c:/Users/ps333/Downloads/Scented_candles_business/src/app/terms/page.tsx), [Shipping Policy](file:///c:/Users/ps333/Downloads/Scented_candles_business/src/app/shipping-policy/page.tsx), and [Refund Policy](file:///c:/Users/ps333/Downloads/Scented_candles_business/src/app/refund-policy/page.tsx).

---

## 🏆 Production Build Verification

Production build was run and passed with zero TypeScript and ESLint errors:
```bash
npm run build
# ✓ Compiled successfully
# ✓ Generating static pages (25/25)
# ✓ Finalizing page optimization
```
