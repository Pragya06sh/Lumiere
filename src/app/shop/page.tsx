"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products, categories, collections } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { Badge } from "@/components/shared/Badge";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialCollection = searchParams.get("collection") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialScent = searchParams.get("scent") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);
  const [searchQuery, setSearchQuery] = useState(initialSearch || initialScent);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [priceMax, setPriceMax] = useState<number>(4000); // in Rupees
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== "all" && !p.category.includes(selectedCategory)) {
        return false;
      }
      // Collection filter
      if (selectedCollection !== "all" && !p.collections.includes(selectedCollection)) {
        return false;
      }
      // Search query filter (name, tagline, scent notes, description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesTag = p.tagline.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesScents = [
          ...p.scentNotes.top,
          ...p.scentNotes.middle,
          ...p.scentNotes.base,
        ].some((note) => note.toLowerCase().includes(q));

        if (!matchesName && !matchesTag && !matchesDesc && !matchesScents) {
          return false;
        }
      }
      // Price filter
      const defaultVariant = p.variants.find((v) => v.isDefault) || p.variants[0];
      const priceRupees = defaultVariant.price / 100;
      if (priceRupees > priceMax) {
        return false;
      }

      return true;
    });
  }, [selectedCategory, selectedCollection, searchQuery, priceMax]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const priceA = (a.variants.find((v) => v.isDefault) || a.variants[0]).price;
      const priceB = (b.variants.find((v) => v.isDefault) || b.variants[0]).price;

      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0; // featured by default
    });
  }, [filteredProducts, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedCollection("all");
    setSearchQuery("");
    setPriceMax(4000);
    setSortBy("featured");
  };

  const isFiltered =
    selectedCategory !== "all" ||
    selectedCollection !== "all" ||
    searchQuery !== "" ||
    priceMax < 4000;

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header Banner */}
        <div className="border-b border-[#E6D8C6] pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="surprise">
              <Sparkles className="w-3.5 h-3.5 text-[#A8742A]" />
              Kolkata Artisanal Collection
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-[#2A1B15] font-medium">
              Festive Candle Collection
            </h1>
            <p className="text-base text-[#5C463B]">
              Showing {sortedProducts.length} handcrafted festive editions
            </p>
          </div>

          {/* Quick Actions (Mobile Filter Button + Sort) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 bg-white border border-[#E6D8C6] px-4 py-2.5 rounded-full text-sm text-[#2A1B15] shadow-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#A8742A]" />
              <span>Filters {isFiltered && "•"}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-[#5C463B] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#E6D8C6] rounded-full px-4 py-2 text-sm text-[#2A1B15] focus:outline-none focus:border-[#5A1E1E] shadow-sm font-medium"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white border border-[#E6D8C6] p-6 rounded-[20px] space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E6D8C6] pb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2A1B15]">
                  Filters
                </span>
                {isFiltered && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-[#5A1E1E] font-medium hover:underline"
                  >
                    Reset all
                  </button>
                )}
              </div>

              {/* Search in Catalog */}
              <div className="space-y-2">
                <label className="text-xs text-[#5C463B] font-semibold block">
                  Search Fragrance
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Saffron, Mogra, Sandalwood..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#E6D8C6] text-sm text-[#2A1B15] pl-9 pr-3 py-2 rounded-xl placeholder-[#5C463B] focus:outline-none focus:border-[#5A1E1E]"
                  />
                  <Search className="w-4 h-4 text-[#5C463B] absolute left-3 top-3" />
                </div>
              </div>

              {/* Collections Filter */}
              <div className="space-y-2">
                <label className="text-xs text-[#5C463B] font-semibold block">
                  Festive Collections
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCollection("all")}
                    className={`w-full text-left px-3.5 py-2 text-sm rounded-xl transition-colors font-medium ${
                      selectedCollection === "all"
                        ? "bg-[#5A1E1E] text-white"
                        : "text-[#5C463B] hover:bg-[#FAF6F0]"
                    }`}
                  >
                    All Collections
                  </button>
                  {collections.map((col) => (
                    <button
                      key={col.slug}
                      onClick={() => setSelectedCollection(col.slug)}
                      className={`w-full text-left px-3.5 py-2 text-sm rounded-xl transition-colors font-medium ${
                        selectedCollection === col.slug
                          ? "bg-[#5A1E1E] text-white"
                          : "text-[#5C463B] hover:bg-[#FAF6F0]"
                      }`}
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Filter */}
              <div className="space-y-2">
                <label className="text-xs text-[#5C463B] font-semibold block">
                  Categories
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3.5 py-2 text-sm rounded-xl transition-colors font-medium ${
                      selectedCategory === "all"
                        ? "bg-[#5A1E1E] text-white"
                        : "text-[#5C463B] hover:bg-[#FAF6F0]"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3.5 py-2 text-sm rounded-xl transition-colors font-medium ${
                        selectedCategory === cat.slug
                          ? "bg-[#5A1E1E] text-white"
                          : "text-[#5C463B] hover:bg-[#FAF6F0]"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price Range Slider */}
              <div className="space-y-2 pt-3 border-t border-[#E6D8C6]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5C463B] font-semibold">Max Price</span>
                  <span className="font-bold text-[#2A1B15] text-sm">₹{priceMax}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="4000"
                  step="100"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#5A1E1E] cursor-pointer"
                />
              </div>
            </div>
          </aside>

          {/* Product Cards Grid */}
          <div className="lg:col-span-3">
            {sortedProducts.length === 0 ? (
              <div className="bg-white border border-[#E6D8C6] p-12 text-center rounded-[20px] space-y-4 shadow-sm">
                <Sparkles className="w-10 h-10 text-[#A8742A] mx-auto opacity-70" />
                <h3 className="font-display text-2xl text-[#2A1B15] font-medium">
                  No candles found
                </h3>
                <p className="text-sm text-[#5C463B] max-w-sm mx-auto">
                  We couldn&apos;t find any candles matching your filter criteria. Try adjusting the search or resetting filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary text-sm py-2.5 px-6 inline-flex"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {sortedProducts.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0] p-12 text-center text-[#5C463B]">Loading festive candles...</div>}>
      <ShopContent />
    </Suspense>
  );
}
