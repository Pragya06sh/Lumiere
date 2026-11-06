"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Gift,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  RefreshCw,
  Inbox,
} from "lucide-react";
import toast from "react-hot-toast";

interface RevealCodeItem {
  id: string;
  code: string;
  orderNumber?: string | null;
  giftName: string;
  isUsed: boolean;
  usedAt: string | null;
  createdAt: string;
  giftPhotoUrl?: string | null;
}

export default function AdminRevealCodesPage() {
  const [codes, setCodes] = useState<RevealCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reveal-codes");
      const data = await res.json();
      if (data.success && Array.isArray(data.codes)) {
        setCodes(data.codes);
      } else {
        toast.error("Failed to load reveal codes from database");
      }
    } catch (err) {
      console.error("Reveal codes fetch error:", err);
      toast.error("Network error fetching reveal codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const filtered = codes.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.giftName.toLowerCase().includes(search.toLowerCase()) ||
      (c.orderNumber && c.orderNumber.toLowerCase().includes(search.toLowerCase()))
  );

  const totalCount = codes.length;
  const redeemedCount = codes.filter((c) => c.isUsed).length;
  const unusedCount = totalCount - redeemedCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B8893C]/20 pb-5">
        <div>
          <span className="text-xs text-[#B8893C] uppercase tracking-wider block mb-1">
            Surprise Candle Verification
          </span>
          <h1 className="text-2xl sm:text-3xl font-display text-[#3A2A22] font-medium">
            Reveal Codes & Redemptions
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCodes}
            className="btn-outline bg-white text-xs py-2 px-3 flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
          <Link
            href="/reveal"
            target="_blank"
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Customer Reveal Portal</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary from Real Database Data */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#B8893C]/20 shadow-xs space-y-1">
          <span className="text-xs text-[#8C7768]">Total Reveal Codes</span>
          <p className="font-display text-2xl text-[#3A2A22] font-semibold">
            {loading ? "..." : totalCount}
          </p>
          <span className="text-[11px] text-[#8C7768] block">
            Generated from database records
          </span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#B8893C]/20 shadow-xs space-y-1">
          <span className="text-xs text-[#8C7768]">Redeemed by Customers</span>
          <p className="font-display text-2xl text-[#E8A33D] font-semibold">
            {loading ? "..." : redeemedCount}
          </p>
          <span className="text-[11px] text-[#8C7768] block">
            Codes unlocked by customers
          </span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#B8893C]/20 shadow-xs space-y-1">
          <span className="text-xs text-[#8C7768]">Unused / Awaiting Burn</span>
          <p className="font-display text-2xl text-[#B8893C] font-semibold">
            {loading ? "..." : unusedCount}
          </p>
          <span className="text-[11px] text-[#8C7768] block">
            Candles yet to reveal their gift
          </span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white border border-[#B8893C]/20 p-3.5 rounded-xl flex items-center gap-3 shadow-xs">
        <Search className="w-4 h-4 text-[#8C7768]" />
        <input
          type="text"
          placeholder="Filter by reveal code, order ref, or gift name..."
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#B8893C]/20 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-[#B8893C] animate-spin mx-auto" />
            <p className="text-xs text-[#8C7768]">Loading reveal codes from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Inbox className="w-10 h-10 text-[#8C7768] mx-auto opacity-40" />
            <h3 className="font-display text-base text-[#3A2A22] font-medium">
              No reveal codes found
            </h3>
            <p className="text-xs text-[#8C7768] max-w-sm mx-auto">
              {search
                ? "No codes match your search query."
                : "No surprise candle reveal codes exist in the database yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#B8893C]/20 text-[#8C7768] uppercase bg-[#FAF6F0]/60">
                  <th className="p-4">Reveal Code</th>
                  <th className="p-4">Gift Sealed Inside</th>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Redeemed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8893C]/10">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FAF6F0]/40 transition-colors"
                  >
                    <td className="p-4 font-mono font-medium text-[#3A2A22]">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-[#E8A33D]" />
                        <span>{item.code}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#3A2A22]">{item.giftName}</td>
                    <td className="p-4 font-mono text-[#8C7768]">
                      {item.orderNumber ? `#${item.orderNumber}` : "—"}
                    </td>
                    <td className="p-4 text-[#8C7768]">{item.createdAt}</td>
                    <td className="p-4">
                      {item.isUsed ? (
                        <span className="badge badge-maroon text-[10px] flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          Redeemed
                        </span>
                      ) : (
                        <span className="badge badge-gold text-[10px] flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" />
                          Unused
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right text-[#8C7768]">
                      {item.usedAt || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
