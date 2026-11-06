"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { formatPrice, calcDiscount, getDeliveryDateRange, isValidPincode } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { ProductCard } from "@/components/shop/ProductCard";
import { Badge } from "@/components/shared/Badge";
import { InfoBar } from "@/components/shared/InfoBar";
import toast from "react-hot-toast";
import {
  Star,
  Heart,
  Share2,
  Truck,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  Gift,
  Sparkles,
  ShieldCheck,
  Package,
} from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.find((v) => v.isDefault) || product.variants[0]
  );
  const [giftAudience, setGiftAudience] = useState<"Her" | "Him" | "Anyone">("Her");
  const [quantity, setQuantity] = useState(1);
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<
    "idle" | "checking" | "serviceable" | "unserviceable"
  >("idle");
  const [activeTab, setActiveTab] = useState<"scent" | "specs" | "usage" | "safety" | "reviews">("scent");

  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const isWishlisted = isInWishlist(product.slug);

  const discount = calcDiscount(selectedVariant.price, selectedVariant.compareAt ?? null);
  const deliveryDates = getDeliveryDateRange(3, 5);

  const handleAddToCart = () => {
    addItem({
      productId: product.slug,
      variantId: selectedVariant.sku,
      name: product.name,
      slug: product.slug,
      variantName: product.hasSurpriseGift
        ? `${selectedVariant.name} (Gift for ${giftAudience})`
        : selectedVariant.name,
      price: selectedVariant.price,
      compareAt: selectedVariant.compareAt,
      image: product.images[0]?.url || "/images/products/rose-pearl-reveal.jpg",
      quantity,
      stock: selectedVariant.stock,
      giftAudience: product.hasSurpriseGift ? giftAudience : undefined,
    });
    toast.success(`Added ${product.name} to your festive bag!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPincode(pincodeInput)) {
      toast.error("Please enter a valid 6-digit Indian PIN code");
      return;
    }

    setPincodeStatus("checking");
    setTimeout(() => {
      const pinNum = parseInt(pincodeInput, 10);
      if (pinNum >= 110001 && pinNum <= 850000) {
        setPincodeStatus("serviceable");
      } else {
        setPincodeStatus("unserviceable");
      }
    }, 350);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.tagline,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  const related = products
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  const isGelCandle = product.slug === "petal-jewel-gel-candle" || product.slug === "raspberry-bubbly-glass-candle";
  const isBouquetOrTray = product.category.includes("flower-bouquets") || product.category.includes("tray-candles") || product.slug === "ribbon-taper-duo";

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#5C463B] mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#2A1B15] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#2A1B15] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-[#2A1B15] font-medium">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/5] bg-white border border-[#E6D8C6] rounded-[24px] overflow-hidden shadow-sm">
              <Image
                src={product.images[selectedImgIdx]?.url || product.images[0]?.url}
                alt={product.images[selectedImgIdx]?.alt || product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge variant="discount">Save {discount}%</Badge>
                </div>
              )}
              {product.hasSurpriseGift && (
                <div className="absolute top-4 right-4">
                  <span className="badge badge-surprise text-xs flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#A8742A]" />
                    Surprise Gift Inside
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImgIdx === idx
                        ? "border-[#F28A3D] shadow-sm"
                        : "border-[#E6D8C6] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-wider text-[#A8742A] font-semibold">
                  {product.category[0].replace("-", " ")}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleItem(product.slug)}
                    className="p-2 bg-white rounded-full border border-[#E6D8C6] text-[#5C463B] hover:text-[#5A1E1E] transition-colors shadow-2xs"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? "fill-[#5A1E1E] text-[#5A1E1E]" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 bg-white rounded-full border border-[#E6D8C6] text-[#5C463B] hover:text-[#2A1B15] transition-colors shadow-2xs"
                    aria-label="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl text-[#2A1B15] font-medium mt-1 leading-tight">
                {product.name}
              </h1>

              <p className="text-sm text-[#A8742A] italic font-accent mt-1">
                {product.tagline}
              </p>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl sm:text-3xl text-[#2A1B15] font-semibold">
                {formatPrice(selectedVariant.price)}
              </span>
              {selectedVariant.compareAt && (
                <span className="text-lg text-[#5C463B] line-through">
                  {formatPrice(selectedVariant.compareAt)}
                </span>
              )}
              <span className="text-xs text-[#5C463B]">
                (Inclusive of all taxes)
              </span>
            </div>

            {/* Description */}
            <p className="text-base text-[#5C463B] leading-relaxed">
              {product.description}
            </p>

            {/* Hamper Exact Contents Display */}
            {product.contentsList && (
              <div className="p-5 bg-white rounded-[20px] border border-[#E6D8C6] space-y-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#F28A3D]" />
                  <h3 className="font-display text-base font-semibold text-[#2A1B15]">
                    Hamper Contents ({selectedVariant.name} Box):
                  </h3>
                </div>
                <ul className="space-y-1.5 text-xs text-[#5C463B] pl-2">
                  {(selectedVariant.name.toLowerCase().includes("grand")
                    ? product.contentsList.grand || []
                    : product.contentsList.classic || []
                  ).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F28A3D] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* REQUIRED GIFT AUDIENCE SELECTOR (For Surprise Inside Products 1 to 7) */}
            {product.hasSurpriseGift && (
              <div className="p-5 bg-white rounded-[20px] border border-[#E6D8C6] space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#F28A3D]" />
                    <span className="text-sm font-semibold text-[#2A1B15]">
                      Surprise Gift Inside:
                    </span>
                  </div>
                  <span className="text-xs text-[#A8742A] font-medium">
                    {product.giftTier === "MYSTERY" && "Mystery Keepsake"}
                    {product.giftTier === "CATEGORY_CHOICE" && "Choose Your Gift Tier"}
                    {product.giftTier === "PREMIUM" && "Premium Metal Box Reveal"}
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="text-xs text-[#2A1B15] font-semibold flex items-center gap-1">
                    <span>Gift for:</span>
                    <span className="text-[#F28A3D]">*</span>
                    <span className="text-[11px] text-[#5C463B] font-normal">
                      (Select who this candle is for to curate their gift)
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Her", "Him", "Anyone"] as const).map((aud) => (
                      <button
                        key={aud}
                        type="button"
                        onClick={() => setGiftAudience(aud)}
                        className={`py-2.5 px-3 rounded-full text-xs font-semibold text-center border transition-all ${
                          giftAudience === aud
                            ? "border-[#F28A3D] bg-[#F28A3D] text-[#1A0F0A] shadow-xs"
                            : "border-[#E6D8C6] bg-white text-[#5C463B] hover:border-[#F28A3D]"
                        }`}
                      >
                        {aud === "Her" && "👩 Her"}
                        {aud === "Him" && "👨 Him"}
                        {aud === "Anyone" && "🎁 Anyone"}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-[#5C463B] leading-relaxed pt-1 border-t border-[#E6D8C6]/60">
                  {product.giftTier === "PREMIUM"
                    ? "The gift sits in the sealed metal box at the bottom, away from the wick. Never revealed until the flame burns down."
                    : "The gift is metal, sealed in a heat-safe pouch or box at the bottom, away from the wick."}
                </p>
              </div>
            )}

            {/* Variant Switcher */}
            {product.variants.length > 1 && (
              <div className="space-y-2">
                <label className="text-xs text-[#5C463B] font-semibold">
                  Choose candle size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.sku}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 text-sm rounded-full border transition-all ${
                        selectedVariant.sku === v.sku
                          ? "border-[#F28A3D] bg-[#FFF8EE] text-[#1A0F0A] font-semibold shadow-xs"
                          : "border-[#E6D8C6] bg-white text-[#5C463B] hover:border-[#5C463B]"
                      }`}
                    >
                      {v.name} • {formatPrice(v.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector + CTA Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#E6D8C6] rounded-full bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-[#5C463B] hover:text-[#5A1E1E]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-semibold text-[#2A1B15]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                    className="p-3 text-[#5C463B] hover:text-[#5A1E1E]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 py-3.5 text-base shadow-sm font-semibold"
                >
                  Add to cart
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="btn-outline w-full py-3.5 text-base bg-white font-semibold"
              >
                Instant checkout with UPI / Card / COD
              </button>
            </div>

            {/* Pincode Delivery Check */}
            <div className="bg-white border border-[#E6D8C6] p-5 rounded-[20px] space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2A1B15]">
                <Truck className="w-4 h-4 text-[#A8742A]" />
                <span>Check delivery date & COD availability</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit Pincode (e.g. 700016)"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value)}
                  maxLength={6}
                  className="flex-1 bg-[#FAF6F0] border border-[#E6D8C6] px-4 py-2 text-sm text-[#2A1B15] rounded-xl font-mono placeholder-[#5C463B] focus:outline-none focus:border-[#F28A3D]"
                />
                <button
                  type="submit"
                  className="bg-[#2A1B15] hover:bg-[#1A0F0A] text-[#FAF6F0] px-5 py-2 text-sm rounded-xl font-semibold shadow-sm transition-colors"
                >
                  Check
                </button>
              </form>

              {pincodeStatus === "serviceable" && (
                <div className="flex items-start gap-2 text-xs text-[#2A1B15]">
                  <CheckCircle className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1B5E20]">Fast Delivery Available!</p>
                    <p className="text-xs text-[#5C463B]">
                      Estimated dispatch: {deliveryDates.from} – {deliveryDates.to}. Cash on delivery available.
                    </p>
                  </div>
                </div>
              )}

              {pincodeStatus === "unserviceable" && (
                <div className="flex items-start gap-2 text-xs text-[#8A1A1A]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    Standard delivery delivers across India (3-7 days). Express fleet currently priority in West Bengal.
                  </p>
                </div>
              )}
            </div>

            {/* Scent, Specs, Safety & Care Tabs */}
            <div className="pt-4 border-t border-[#E6D8C6] space-y-4">
              <div className="flex border-b border-[#E6D8C6] gap-4 text-sm overflow-x-auto whitespace-nowrap">
                <button
                  onClick={() => setActiveTab("scent")}
                  className={`pb-2.5 font-semibold transition-colors ${
                    activeTab === "scent"
                      ? "text-[#F28A3D] border-b-2 border-[#F28A3D]"
                      : "text-[#5C463B] hover:text-[#2A1B15]"
                  }`}
                >
                  Scent Notes
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`pb-2.5 font-semibold transition-colors ${
                    activeTab === "specs"
                      ? "text-[#F28A3D] border-b-2 border-[#F28A3D]"
                      : "text-[#5C463B] hover:text-[#2A1B15]"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("usage")}
                  className={`pb-2.5 font-semibold transition-colors ${
                    activeTab === "usage"
                      ? "text-[#F28A3D] border-b-2 border-[#F28A3D]"
                      : "text-[#5C463B] hover:text-[#2A1B15]"
                  }`}
                >
                  Candle Care
                </button>
                <button
                  onClick={() => setActiveTab("safety")}
                  className={`pb-2.5 font-semibold transition-colors ${
                    activeTab === "safety"
                      ? "text-[#F28A3D] border-b-2 border-[#F28A3D]"
                      : "text-[#5C463B] hover:text-[#2A1B15]"
                  }`}
                >
                  Safety Guidelines
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-2.5 font-semibold transition-colors ${
                    activeTab === "reviews"
                      ? "text-[#F28A3D] border-b-2 border-[#F28A3D]"
                      : "text-[#5C463B] hover:text-[#2A1B15]"
                  }`}
                >
                  Customer Reviews
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "scent" && (
                <div className="space-y-3 text-sm bg-white p-5 rounded-[20px] border border-[#E6D8C6] shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-[#5C463B] w-24 shrink-0 font-medium">Top Notes:</span>
                    <div className="flex gap-2 flex-wrap">
                      {product.scentNotes.top.map((n) => (
                        <Badge key={n} variant="gold">{n}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#5C463B] w-24 shrink-0 font-medium">Heart Notes:</span>
                    <div className="flex gap-2 flex-wrap">
                      {product.scentNotes.middle.map((n) => (
                        <Badge key={n} variant="surprise">{n}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#5C463B] w-24 shrink-0 font-medium">Base Notes:</span>
                    <div className="flex gap-2 flex-wrap">
                      {product.scentNotes.base.map((n) => (
                        <Badge key={n} variant="neutral">{n}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "specs" && (
                <div className="grid grid-cols-2 gap-4 text-sm bg-white p-5 rounded-[20px] border border-[#E6D8C6] shadow-sm">
                  <div>
                    <span className="text-[#5C463B] block">Burn Time:</span>
                    <span className="text-[#2A1B15] font-semibold">{product.burnTime}</span>
                  </div>
                  <div>
                    <span className="text-[#5C463B] block">Wax Blend:</span>
                    <span className="text-[#2A1B15] font-semibold">{product.waxType}</span>
                  </div>
                  <div>
                    <span className="text-[#5C463B] block">Wick:</span>
                    <span className="text-[#2A1B15] font-semibold">{product.wickType}</span>
                  </div>
                  <div>
                    <span className="text-[#5C463B] block">Weight:</span>
                    <span className="text-[#2A1B15] font-semibold">{product.weight}</span>
                  </div>
                </div>
              )}

              {activeTab === "usage" && (
                <div className="text-sm text-[#5C463B] bg-white p-5 rounded-[20px] border border-[#E6D8C6] shadow-sm whitespace-pre-line leading-relaxed">
                  {product.howToUse}
                </div>
              )}

              {activeTab === "safety" && (
                <div className="space-y-4 bg-white p-5 rounded-[20px] border border-[#E6D8C6] shadow-sm text-sm text-[#5C463B]">
                  <p className="leading-relaxed whitespace-pre-line">
                    {product.safetyTips}
                  </p>

                  {product.hasSurpriseGift && (
                    <div className="p-3 bg-[#FFF8EE] rounded-xl border border-[#F28A3D]/30 flex items-start gap-2.5 text-xs text-[#2A1B15]">
                      <ShieldCheck className="w-4 h-4 text-[#F28A3D] shrink-0 mt-0.5" />
                      <span>
                        <strong>Keepsake Safety Notice:</strong> The gift is metal, sealed in a heat-safe pouch or box at the bottom, away from the wick. Never reach into liquid wax.
                      </span>
                    </div>
                  )}

                  {isGelCandle && (
                    <div className="p-3 bg-[#FFF8EE] rounded-xl border border-[#F28A3D]/30 flex items-start gap-2.5 text-xs text-[#2A1B15]">
                      <AlertCircle className="w-4 h-4 text-[#F28A3D] shrink-0 mt-0.5" />
                      <span>
                        <strong>Gel Candle Care:</strong> Use on a heat-safe surface. Do not move while burning. Keep dried flowers and decorations away from the flame.
                      </span>
                    </div>
                  )}

                  {isBouquetOrTray && (
                    <div className="p-3 bg-[#FFF8EE] rounded-xl border border-[#F28A3D]/30 flex items-start gap-2.5 text-xs text-[#2A1B15]">
                      <AlertCircle className="w-4 h-4 text-[#F28A3D] shrink-0 mt-0.5" />
                      <span>
                        <strong>Presentation Care:</strong> Remove all paper wrapping before lighting. Burn on a heat-safe surface. Never leave unattended.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="py-10 text-center space-y-2 bg-white p-5 rounded-[20px] border border-[#E6D8C6] shadow-sm">
                  <Star className="w-7 h-7 text-[#D9A441] mx-auto opacity-40" />
                  <p className="text-sm font-medium text-[#2A1B15]">No reviews yet</p>
                  <p className="text-xs text-[#5C463B] max-w-sm mx-auto">
                    Be the first verified customer to burn this candle and share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION: Surprise Inside Highlight (If Applicable) */}
        {product.hasSurpriseGift && (
          <div className="mt-16 bg-white border border-[#E6D8C6] rounded-[24px] p-6 md:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <Badge variant="surprise">
                  <Sparkles className="w-3.5 h-3.5 text-[#A8742A]" />
                  The Magic Unfolds
                </Badge>
                <h2 className="font-display text-2xl sm:text-3xl text-[#2A1B15] font-medium">
                  What&apos;s hidden inside?
                </h2>
                <p className="text-base text-[#5C463B] leading-relaxed">
                  Every {product.name} conceals a sealed metal keepsake treasure nestled safely beneath the wax. As your candle flickers evening after evening, the wax slowly lowers until the protective heat-safe casing gently emerges.
                </p>
                <p className="text-sm text-[#5C463B] italic">
                  (Curated specifically for {giftAudience} — keeping every celebration full of authentic delight!)
                </p>

                <InfoBar variant="safety" title="Safety first">
                  The gift is metal, sealed in a heat-safe pouch or box at the bottom, away from the wick. Never leave a burning candle unattended. Stop burning when 1 cm of wax is left. Keep away from children and pets.
                </InfoBar>
              </div>

              {/* Gentle animated illustration */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-64 h-72 bg-[#FAF6F0] rounded-[20px] border border-[#E6D8C6] p-4 flex flex-col items-center justify-between shadow-inner overflow-hidden">
                  <div className="relative mt-2">
                    <div className="w-5 h-8 bg-gradient-to-t from-[#F28A3D] via-[#F4C47A] to-white rounded-full flame-flicker shadow-[0_0_15px_#F28A3D]" />
                    <div className="w-1 h-3 bg-[#2A1B15] mx-auto mt-0.5" />
                  </div>

                  <div className="relative w-40 h-40 bg-gradient-to-b from-[#FFFDF9] to-[#F1E8DC] border border-[#E6D8C6] rounded-xl overflow-hidden flex flex-col justify-end p-2 shadow-sm">
                    <div className="relative w-full h-14 bg-gradient-to-t from-[#FFF8EE] to-transparent border-t border-dashed border-[#F28A3D]/50 flex items-center justify-center">
                      <div className="relative flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-[#F28A3D]/20 animate-ping absolute" />
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F28A3D] to-[#D9A441] flex items-center justify-center shadow-md">
                          <Sparkles className="w-4 h-4 text-white animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#A8742A] mt-2">
                    ✨ Sealed protective metal keepsake
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        <div className="mt-16 pt-12 border-t border-[#E6D8C6]">
          <h2 className="text-2xl sm:text-3xl font-display text-[#2A1B15] font-medium mb-8">
            You may also cherish
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
