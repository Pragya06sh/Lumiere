"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Package,
  Plus,
  Search,
  CheckCircle,
  Eye,
  Edit2,
  Gift,
  Save,
  X,
  RefreshCw,
  Inbox,
} from "lucide-react";

interface AdminVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAt?: number | null;
  stock: number;
}

interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  hasSurpriseGift: boolean;
  giftTier?: string | null;
  giftDescriptionInternal?: string | null;
  giftStock: number;
  giftStockHer?: number;
  giftStockHim?: number;
  giftStockAnyone?: number;
  giftItemsHer?: string[];
  giftItemsHim?: string[];
  giftItemsAnyone?: string[];
  categories: string[];
  variants: AdminVariant[];
  images: Array<{ url: string; alt: string }>;
}

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProductList(data.products);
      } else {
        toast.error("Failed to load products from database");
      }
    } catch (err) {
      console.error("Products fetch error:", err);
      toast.error("Network error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = productList.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categories.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: editingProduct.slug,
          hasSurpriseGift: editingProduct.hasSurpriseGift,
          giftTier: editingProduct.giftTier,
          giftStock: editingProduct.giftStock,
          giftStockHer: editingProduct.giftStockHer,
          giftStockHim: editingProduct.giftStockHim,
          giftStockAnyone: editingProduct.giftStockAnyone,
          giftItemsHer: editingProduct.giftItemsHer,
          giftItemsHim: editingProduct.giftItemsHim,
          giftItemsAnyone: editingProduct.giftItemsAnyone,
          giftDescriptionInternal: editingProduct.giftDescriptionInternal,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProductList((prev) =>
          prev.map((p) =>
            p.slug === editingProduct.slug ? editingProduct : p
          )
        );
        toast.success(
          `Updated surprise gift settings for ${editingProduct.name}`
        );
        setEditingProduct(null);
      } else {
        toast.error(data.error || "Failed to update product in database");
      }
    } catch (err) {
      console.error("Product save error:", err);
      toast.error("Network error saving product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B8893C]/20 pb-5">
        <div>
          <span className="text-xs text-[#B8893C] uppercase tracking-wider block mb-1">
            Catalog & Surprise Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-display text-[#3A2A22] font-medium">
            Product Inventory ({productList.length} items)
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            className="btn-outline bg-white text-xs py-2 px-3 flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-[#B8893C]/20 p-3.5 rounded-xl flex items-center gap-3 shadow-xs">
        <Search className="w-4 h-4 text-[#8C7768]" />
        <input
          type="text"
          placeholder="Filter by candle name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-xs text-[#3A2A22] placeholder-[#8C7768] outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs text-[#8C7768] hover:text-[#3A2A22]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Edit Modal (Gift Tier & Stock) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#B8893C]/30 p-6 space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#B8893C]/15 pb-3">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#E8A33D]" />
                <h3 className="font-display text-lg text-[#3A2A22] font-medium">
                  Configure Surprise Gift: {editingProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-[#8C7768] hover:text-[#3A2A22]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#3A2A22] font-medium mb-1">
                  Has Surprise Gift Inside?
                </label>
                <select
                  value={editingProduct.hasSurpriseGift ? "true" : "false"}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      hasSurpriseGift: e.target.value === "true",
                    })
                  }
                  className="input-field"
                >
                  <option value="true">Yes — Candle has hidden gift</option>
                  <option value="false">No — Regular candle</option>
                </select>
              </div>

              {editingProduct.hasSurpriseGift && (
                <>
                  <div>
                    <label className="block text-[#3A2A22] font-medium mb-1">
                      Gift Tier
                    </label>
                    <select
                      value={editingProduct.giftTier || "MYSTERY"}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          giftTier: e.target.value,
                        })
                      }
                      className="input-field"
                    >
                      <option value="MYSTERY">Mystery gift (Unknown)</option>
                      <option value="CATEGORY_CHOICE">
                        Choose your category
                      </option>
                      <option value="PREMIUM">
                        Premium reveal (Higher value)
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#3A2A22] text-xs font-medium mb-1">
                        Stock (Her)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={editingProduct.giftStockHer ?? 0}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            giftStockHer: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        className="input-field text-xs py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[#3A2A22] text-xs font-medium mb-1">
                        Stock (Him)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={editingProduct.giftStockHim ?? 0}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            giftStockHim: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        className="input-field text-xs py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[#3A2A22] text-xs font-medium mb-1">
                        Stock (Anyone)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={editingProduct.giftStockAnyone ?? 0}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            giftStockAnyone: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        className="input-field text-xs py-1.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-[#B8893C]/15 pt-2">
                    <p className="text-xs font-semibold text-[#3A2A22]">
                      Private Gift Items (Internal Only - comma separated)
                    </p>
                    <div>
                      <label className="block text-[#6B5548] text-[11px] mb-0.5">
                        Her Gifts
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(editingProduct.giftItemsHer) ? editingProduct.giftItemsHer.join(", ") : ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            giftItemsHer: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="earrings, pendant, ring, bracelet"
                        className="input-field text-xs py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6B5548] text-[11px] mb-0.5">
                        Him Gifts
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(editingProduct.giftItemsHim) ? editingProduct.giftItemsHim.join(", ") : ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            giftItemsHim: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="keychain, ring, bracelet, cufflinks"
                        className="input-field text-xs py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6B5548] text-[11px] mb-0.5">
                        Anyone Gifts
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(editingProduct.giftItemsAnyone) ? editingProduct.giftItemsAnyone.join(", ") : ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            giftItemsAnyone: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="brass charm, coin, keychain"
                        className="input-field text-xs py-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#3A2A22] font-medium mb-1">
                      Internal Gift Description (Admin only)
                    </label>
                    <textarea
                      rows={2}
                      value={editingProduct.giftDescriptionInternal || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          giftDescriptionInternal: e.target.value,
                        })
                      }
                      placeholder="e.g. Keepsake metal treasure sealed in heat-proof pouch..."
                      className="input-field"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#B8893C]/15">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="btn-outline text-xs py-2 px-4 bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving to DB..." : "Save Configuration"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#B8893C]/20 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-[#B8893C] animate-spin mx-auto" />
            <p className="text-xs text-[#8C7768]">
              Loading product catalog from database...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Inbox className="w-10 h-10 text-[#8C7768] mx-auto opacity-40" />
            <h3 className="font-display text-base text-[#3A2A22] font-medium">
              No products found
            </h3>
            <p className="text-xs text-[#8C7768] max-w-sm mx-auto">
              {search
                ? "No products match your search query."
                : "No products exist in the database."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#B8893C]/20 text-[#8C7768] uppercase bg-[#FAF6F0]/60">
                  <th className="p-4">Candle</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Surprise Tier</th>
                  <th className="p-4">Gift Stock</th>
                  <th className="p-4">Starting Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8893C]/10">
                {filtered.map((product) => {
                  const prices = product.variants.map((v) => v.price);
                  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

                  return (
                    <tr
                      key={product.slug}
                      className="hover:bg-[#FAF6F0]/40 transition-colors"
                    >
                      <td className="p-4 flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-[#FAF6F0] border border-[#B8893C]/20 overflow-hidden shrink-0">
                          <Image
                            src={
                              product.images[0]?.url ||
                              "/images/products/rose-pearl-reveal.jpg"
                            }
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-[#3A2A22]">
                            {product.name}
                          </p>
                          {product.tagline && (
                            <p className="text-[10px] text-[#8C7768] line-clamp-1 italic font-accent">
                              {product.tagline}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-[#6B5548]">
                        {product.categories.length > 0
                          ? product.categories[0].replace("-", " ")
                          : "Diwali"}
                      </td>

                      <td className="p-4">
                        {product.hasSurpriseGift ? (
                          <span className="badge badge-surprise text-[10px] flex items-center gap-1 w-fit">
                            <Gift className="w-3 h-3 text-[#E8A33D]" />
                            {product.giftTier || "MYSTERY"}
                          </span>
                        ) : (
                          <span className="text-[#8C7768] text-[11px]">None</span>
                        )}
                      </td>

                      <td className="p-4">
                        {product.hasSurpriseGift ? (
                          <div className="text-xs">
                            <span className="font-mono font-medium block text-[#3A2A22]">
                              {(product.giftStockHer ?? 0) + (product.giftStockHim ?? 0) + (product.giftStockAnyone ?? 0) || product.giftStock} units
                            </span>
                            <span className="text-[10px] text-[#8C7768]">
                              Her: {product.giftStockHer ?? 0} | Him: {product.giftStockHim ?? 0} | Any: {product.giftStockAnyone ?? 0}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#8C7768]">—</span>
                        )}
                      </td>

                      <td className="p-4 font-mono font-medium text-[#3A2A22]">
                        {formatPrice(minPrice)}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="btn-outline bg-white text-[11px] py-1.5 px-3 flex items-center gap-1 ml-auto shadow-xs"
                        >
                          <Edit2 className="w-3 h-3 text-[#B8893C]" />
                          <span>Edit Surprise</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
