import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/shared/Logo";
import { ShieldCheck, Truck, CreditCard, Gift, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#3A1410] text-[#F8EFE6] pt-16 md:pt-24 pb-12 mt-16 md:mt-24 relative border-t border-[#D9A441]/20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pb-12 border-b border-[#D9A441]/20 text-center">
          <div className="flex flex-col items-center p-5 rounded-[24px] bg-[#2E100C] border border-[#D9A441]/20 shadow-sm">
            <Truck className="w-6 h-6 text-[#F28A3D] mb-2" />
            <h4 className="text-sm font-semibold text-[#F8EFE6]">
              Pan-India Delivery
            </h4>
            <p className="text-xs text-[#CDB8A6] mt-1 font-light">
              Carefully dispatched across India in 3-7 days
            </p>
          </div>

          <div className="flex flex-col items-center p-5 rounded-[24px] bg-[#2E100C] border border-[#D9A441]/20 shadow-sm">
            <Gift className="w-6 h-6 text-[#F28A3D] mb-2" />
            <h4 className="text-sm font-semibold text-[#F8EFE6]">
              Surprise Gift Inside
            </h4>
            <p className="text-xs text-[#CDB8A6] mt-1 font-light">
              Hidden treasures reveal as your candle burns
            </p>
          </div>

          <div className="flex flex-col items-center p-5 rounded-[24px] bg-[#2E100C] border border-[#D9A441]/20 shadow-sm">
            <CreditCard className="w-6 h-6 text-[#F28A3D] mb-2" />
            <h4 className="text-sm font-semibold text-[#F8EFE6]">
              UPI, Cards & COD
            </h4>
            <p className="text-xs text-[#CDB8A6] mt-1 font-light">
              Instant UPI QR, Razorpay & Cash on Delivery
            </p>
          </div>

          <div className="flex flex-col items-center p-5 rounded-[24px] bg-[#2E100C] border border-[#D9A441]/20 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-[#F28A3D] mb-2" />
            <h4 className="text-sm font-semibold text-[#F8EFE6]">
              Pure Artisanal Wax
            </h4>
            <p className="text-xs text-[#CDB8A6] mt-1 font-light">
              Artisanal soy blend wax & cotton wicks
            </p>
          </div>
        </div>

        {/* Centered Luxury Footer Brand Logo */}
        <div className="py-14 border-b border-[#D9A441]/20 flex flex-col items-center text-center">
          <Logo variant="footer" theme="dark" showSubtitle={true} showEst={true} />
          <p className="mt-4 text-xs tracking-[0.25em] uppercase text-[#CDB8A6] max-w-md font-light">
            {siteConfig.tagline}
          </p>
        </div>

        {/* Main Footer Links - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 py-12 border-b border-[#D9A441]/20">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#F8EFE6] font-semibold block">
              Quiet Luxury
            </span>
            <p className="text-sm text-[#CDB8A6] leading-relaxed font-light">
              Every {siteConfig.brandName} candle is hand-poured with care, with a little surprise waiting at the end of the flame.
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-[#CDB8A6]">
              <p>{siteConfig.business.address}</p>
              <a
                href={siteConfig.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F28A3D] transition-colors block"
              >
                Instagram: {siteConfig.contact.instagramHandle}
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#F8EFE6] mb-4 font-semibold">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-[#CDB8A6]">
              <li>
                <Link href="/surprise" className="hover:text-[#F28A3D] transition-colors flex items-center gap-1.5 text-[#F28A3D]">
                  <Sparkles className="w-3.5 h-3.5 text-[#F28A3D]" />
                  Surprise Inside
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#F28A3D] transition-colors">
                  Curated Gift Sets
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#F28A3D] transition-colors">
                  Curated Gift Boxes
                </Link>
              </li>
              <li>
                <Link href="/shop?collection=luxury-picks" className="hover:text-[#F28A3D] transition-colors">
                  Luxury Picks
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#F28A3D] transition-colors">
                  All Candles
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#F8EFE6] mb-4 font-semibold">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-[#CDB8A6]">
              <li>
                <Link href="/track-order" className="hover:text-[#F28A3D] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F28A3D] transition-colors">
                  Concierge Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#F28A3D] transition-colors">
                  Care &amp; Safety Guide
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F28A3D] transition-colors">
                  Our Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Safety */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#F8EFE6] mb-4 font-semibold">
              Legal &amp; Heritage
            </h4>
            <ul className="space-y-2.5 text-sm text-[#CDB8A6]">
              <li>
                <Link href="/terms" className="hover:text-[#F28A3D] transition-colors">
                  Terms &amp; Surprise Safety
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#F28A3D] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#F28A3D] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#F28A3D] transition-colors">
                  Refund &amp; Cancellation
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#CDB8A6]/60 hover:text-[#F28A3D] transition-colors">
                  Staff Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & payment icons */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#CDB8A6]">
          <p>
            © {new Date().getFullYear()} {siteConfig.business.legalName}. Handcrafted with care.
          </p>
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="px-3 py-1 bg-[#2E100C] border border-[#D9A441]/20 rounded-full text-[#F8EFE6]">
              BHIM UPI
            </span>
            <span className="px-3 py-1 bg-[#2E100C] border border-[#D9A441]/20 rounded-full text-[#F8EFE6]">
              Google Pay
            </span>
            <span className="px-3 py-1 bg-[#2E100C] border border-[#D9A441]/20 rounded-full text-[#F8EFE6]">
              RuPay / Cards
            </span>
            <span className="px-3 py-1 bg-[#2E100C] border border-[#D9A441]/20 rounded-full text-[#F8EFE6]">
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
