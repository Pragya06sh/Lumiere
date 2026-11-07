"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  CheckCircle,
  Clock,
  Phone,
  Trash2,
  RefreshCw,
  MessageCircle,
  Package,
} from "lucide-react";
import { Badge } from "@/components/shared/Badge";

interface ContactMsg {
  id: string;
  name: string;
  phone: string;
  orderNumber: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [search, setSearch] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: !currentRead }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: !currentRead } : m))
        );
      }
    } catch (err) {
      console.error("Error toggling read status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const filtered = messages.filter((m) => {
    if (filter === "UNREAD" && m.isRead) return false;
    if (filter === "READ" && !m.isRead) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchPhone = m.phone.toLowerCase().includes(q);
      const matchOrder = m.orderNumber?.toLowerCase().includes(q);
      const matchMsg = m.message.toLowerCase().includes(q);
      return matchName || matchPhone || matchOrder || matchMsg;
    }
    return true;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#B8893C]/20">
        <div>
          <span className="text-xs text-[#B8893C] uppercase tracking-wider block mb-1">
            Customer Relations
          </span>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-display text-[#3A2A22] font-medium">
              Customer Inquiries
            </h1>
            {unreadCount > 0 && (
              <span className="bg-[#D9A441] text-[#1A0F0A] text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs text-[#8C7768] mt-1">
            Manage incoming notes and queries submitted via the Contact Concierge form
          </p>
        </div>

        <button
          onClick={fetchMessages}
          disabled={loading}
          className="btn-outline text-xs py-2 px-4 bg-white self-start sm:self-auto flex items-center gap-1.5 shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="flex gap-2">
          {(["ALL", "UNREAD", "READ"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                filter === tab
                  ? "bg-[#3A2A22] text-[#FAF6F0]"
                  : "bg-white border border-[#B8893C]/20 text-[#6B5548] hover:bg-[#FAF6F0]"
              }`}
            >
              {tab === "ALL" ? `All (${messages.length})` : tab === "UNREAD" ? `Unread (${unreadCount})` : "Resolved"}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#8C7768] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, phone, order..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#B8893C]/20 text-xs pl-9 pr-4 py-2 rounded-xl text-[#3A2A22] placeholder-[#8C7768]/60 focus:border-[#B8893C] outline-none"
          />
        </div>
      </div>

      {/* Message Cards List */}
      {loading ? (
        <div className="bg-white border border-[#B8893C]/20 rounded-2xl p-12 text-center text-xs text-[#8C7768]">
          Loading customer messages...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#B8893C]/20 rounded-2xl p-12 text-center space-y-3">
          <MessageSquare className="w-8 h-8 text-[#8C7768] mx-auto opacity-40" />
          <p className="text-sm font-medium text-[#3A2A22]">No messages found</p>
          <p className="text-xs text-[#8C7768]">
            {search || filter !== "ALL"
              ? "No inquiries match your current search or status filter."
              : "No customer messages have been received yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => {
            const dateStr = new Date(msg.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            const cleanPhone = msg.phone.replace(/[^0-9]/g, "");

            return (
              <div
                key={msg.id}
                className={`bg-white border rounded-2xl p-5 md:p-6 transition-all shadow-xs space-y-4 ${
                  msg.isRead
                    ? "border-[#B8893C]/15 opacity-85"
                    : "border-[#D9A441] ring-1 ring-[#D9A441]/20"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#B8893C]/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-base text-[#3A2A22]">
                      {msg.name}
                    </span>
                    {!msg.isRead && (
                      <span className="badge badge-gold text-[9px]">
                        Unread
                      </span>
                    )}
                    {msg.orderNumber && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-[#FAF6F0] border border-[#B8893C]/20 px-2 py-0.5 rounded text-[#6B5548]">
                        <Package className="w-3 h-3 text-[#B8893C]" />
                        #{msg.orderNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#8C7768]">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {dateStr}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="text-sm text-[#4A372D] leading-relaxed whitespace-pre-wrap bg-[#FAF6F0]/60 p-4 rounded-xl border border-[#B8893C]/10">
                  {msg.message}
                </div>

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#B8893C]/20 hover:border-[#B8893C] text-xs text-[#3A2A22] bg-white transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#B8893C]" />
                      <span>{msg.phone}</span>
                    </a>
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone}?text=${encodeURIComponent(
                          `Hello ${msg.name}, thank you for contacting Wick & Wish regarding your inquiry.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#25D366]/40 hover:bg-[#25D366]/10 text-xs text-[#1B5E20] bg-white transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>Reply on WhatsApp</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(msg.id, msg.isRead)}
                      className="px-3 py-1.5 rounded-lg border border-[#B8893C]/20 hover:bg-[#FAF6F0] text-xs text-[#6B5548] transition-colors"
                    >
                      {msg.isRead ? "Mark as Unread" : "Mark as Resolved"}
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

