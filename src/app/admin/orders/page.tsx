"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  Printer,
  Search,
  RefreshCw,
  Inbox,
  Clock,
  CheckCircle,
} from "lucide-react";

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  pincode: string;
  itemsSummary: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  date: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        toast.error("Failed to load orders from database");
      }
    } catch (err) {
      console.error("Orders fetch error:", err);
      toast.error("Network error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error(data.error || "Failed to update order status");
      }
    } catch (err) {
      toast.error("Error updating order status");
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.pincode.includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B8893C]/20 pb-5">
        <div>
          <span className="text-xs text-[#B8893C] uppercase tracking-wider block mb-1">
            Fulfillment & Shipping
          </span>
          <h1 className="text-2xl sm:text-3xl font-display text-[#3A2A22] font-medium">
            Orders Dispatch Queue ({orders.length})
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="btn-outline bg-white text-xs py-2 px-3 flex items-center gap-1.5 shadow-xs"
            title="Refresh order queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Status Filter Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {["ALL", "PLACED", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  statusFilter === st
                    ? "bg-[#B8893C] text-white font-medium shadow-xs"
                    : "bg-white border border-[#B8893C]/20 text-[#6B5548] hover:text-[#3A2A22]"
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>

        {/* Search Input */}
        <div className="bg-white border border-[#B8893C]/20 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-xs min-w-[260px]">
          <Search className="w-4 h-4 text-[#8C7768]" />
          <input
            type="text"
            placeholder="Search by ID, customer, PIN..."
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
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-[#B8893C]/20 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-[#B8893C] animate-spin mx-auto" />
            <p className="text-xs text-[#8C7768]">Loading real orders from database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Inbox className="w-10 h-10 text-[#8C7768] mx-auto opacity-40" />
            <h3 className="font-display text-base text-[#3A2A22] font-medium">
              No orders found
            </h3>
            <p className="text-xs text-[#8C7768] max-w-sm mx-auto">
              {search || statusFilter !== "ALL"
                ? "No orders match your search or filter criteria."
                : "No customer orders have been placed in the database yet. Real orders will appear here automatically."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#B8893C]/20 text-[#8C7768] uppercase bg-[#FAF6F0]/60">
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer & Location</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status & Dispatch</th>
                  <th className="p-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8893C]/10">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#FAF6F0]/40 transition-colors"
                  >
                    <td className="p-4 font-mono">
                      <span className="font-bold text-[#3A2A22] block">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[10px] text-[#8C7768]">
                        {order.date}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-medium text-sm text-[#3A2A22] block">
                        {order.customerName}
                      </span>
                      <span className="text-[10px] text-[#8C7768]">
                        {order.phone} • {order.city} (PIN {order.pincode})
                      </span>
                    </td>

                    <td className="p-4 text-xs text-[#6B5548] max-w-xs">
                      {order.itemsSummary}
                    </td>

                    <td className="p-4 font-mono font-semibold text-[#3A2A22]">
                      {formatPrice(order.total)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`badge text-[9px] ${
                          order.paymentStatus === "PAID"
                            ? "badge-gold"
                            : "badge-sand"
                        }`}
                      >
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="bg-white border border-[#B8893C]/30 text-xs px-2.5 py-1.5 rounded-lg text-[#3A2A22] focus:border-[#B8893C] outline-none"
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => window.print()}
                        className="p-1.5 bg-white border border-[#B8893C]/20 hover:border-[#B8893C] text-[#8C7768] hover:text-[#3A2A22] rounded-lg shadow-2xs"
                        title="Print Order Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
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
