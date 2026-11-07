"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductSeedData } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { Heart, Plus, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: ProductSeedData;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRealBestseller, setIsRealBestseller] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();

  useEffect(() => {
    // Only fetch dynamic bestseller list once
    fetch("/api/products/bestsellers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.bestsellerSlugs)) {
          setIsRealBestseller(data.bestsellerSlugs.includes(product.slug));
        }
      })
      .catch(() => {});
  }, [product.slug]);

  const defaultVariant =
    product.variants.find((v) => v.isDefault) || product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

  const isWishlisted = isInWishlist(product.slug);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.slug,
      variantId: selectedVariant.sku,
      name: product.name,
      slug: product.slug,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      compareAt: selectedVariant.compareAt,
      image: product.images[0]?.url || "/images/products/rose-pearl-reveal.jpg",
      quantity: 1,
      stock: selectedVariant.stock,
      giftAudience: product.hasSurpriseGift ? "Anyone" : undefined,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.slug);
  };

  const isSpiral =
    product.category.includes("spiral-wish") ||
    product.collections?.includes("spiral-wish");
  const isSignature =
    Boolean(product.isSignature) || product.slug === "noir-peony-spiral";

  const getBadge = () => {
    if (isSignature) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-serif font-medium tracking-[0.08em] bg-[#D9A441]/25 text-[#7A5500] border border-[#D9A441]/60 shadow-xs">
          <Sparkles className="w-3 h-3 text-[#D9A441]" />
          Our Signature
        </span>
      );
    }
    if (isSpiral) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-[0.08em] bg-[#2A1B15]/10 text-[#2A1B15] border border-[#2A1B15]/20">
          Spiral Wish
        </span>
      );
    }
    if (isRealBestseller) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D9A441]/20 text-[#7A5500] border border-[#D9A441]/40">
          Bestseller
        </span>
      );
    }
    if (product.hasSurpriseGift) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F28A3D]/20 text-[#8C3D00] border border-[#F28A3D]/40">
          <Sparkles className="w-3 h-3 text-[#F28A3D]" />
          Surprise inside
        </span>
      );
    }
    if (product.burnTime && !product.burnTime.includes("shared after")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#2A1B15]/10 text-[#5C463B] border border-[#2A1B15]/15">
          {product.burnTime}
        </span>
      );
    }
    return null;
  };

  return (
    <article
      className="group bg-[#FAF3EA] border border-[#E6D8C6] rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_32px_rgba(242,138,61,0.18)] hover:border-[#D9A441]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Image on top in a rounded frame (strictly NO text overlaid on image) */}
      <div className="p-3 pb-0">
        <div className="relative aspect-square w-full bg-[#F5ECE0] overflow-hidden rounded-[20px] border border-[#E6D8C6]/80">
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
            <Image
              src={
                isHovered && product.images[1]
                  ? product.images[1].url
                  : product.images[0]?.url || "/images/products/rose-pearl-reveal.jpg"
              }
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-3 right-3 p-2 rounded-full bg-[#FAF3EA]/95 hover:bg-white text-[#5C463B] hover:text-[#F28A3D] border border-[#E6D8C6] transition-all shadow-sm z-10"
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isWishlisted ? "fill-[#F28A3D] text-[#F28A3D]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Info strictly BELOW image with 24px (20px mobile) padding */}
      <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Badge row */}
          <div className="min-h-[24px] flex items-center gap-2 mb-2">
            {getBadge()}
          </div>

          {/* Product Name (serif) */}
          <Link
            href={`/product/${product.slug}`}
            className="block text-[#2A1B15] hover:text-[#F28A3D] transition-colors"
          >
            <h3 className="font-display text-lg md:text-xl font-medium leading-snug truncate">
              {product.name}
            </h3>
          </Link>

          {/* One-line tagline with ellipsis */}
          <p className="text-sm text-[#5C463B] italic truncate mt-1">
            &ldquo;{product.tagline}&rdquo;
          </p>

          {/* Variant pills if more than 1 */}
          {product.variants.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {product.variants.map((v) => (
                <button
                  key={v.sku}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    selectedVariant.sku === v.sku
                      ? "border-[#F28A3D] text-[#8C3D00] bg-[#F28A3D]/10 font-semibold"
                      : "border-[#E6D8C6] text-[#5C463B] hover:border-[#5C463B]"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Price on left, Free delivery on right, round Add button */}
        <div className="mt-4 pt-3 border-t border-[#E6D8C6] flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-lg md:text-xl font-bold text-[#2A1B15]">
                {formatPrice(selectedVariant.price)}
              </span>
              {selectedVariant.compareAt && (
                <span className="text-xs text-[#5C463B] line-through">
                  {formatPrice(selectedVariant.compareAt)}
                </span>
              )}
            </div>
            <span className="text-xs text-[#5C463B] font-medium block">
              Free delivery
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-[#F28A3D] hover:bg-[#ff9d55] text-[#1A0F0A] flex items-center justify-center font-bold shadow-[0_2px_10px_rgba(242,138,61,0.35)] transition-all active:scale-95 hover:scale-105 shrink-0"
            aria-label={`Add ${product.name} to cart`}
            title="Add to cart"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </article>
  );
}
