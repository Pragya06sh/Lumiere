"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  RefreshCw,
  ShoppingBag,
  Calendar,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  registeredAt: string;
  totalOrders: number;
  totalSpend: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (data.success && Array.isArray(data.customers)) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#B8893C]/20">
        <div>
          <span className="text-xs text-[#B8893C] uppercase tracking-wider block mb-1">
            Accounts &amp; Clients
          </span>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-display text-[#3A2A22] font-medium">
              Registered Clients
            </h1>
            <span className="bg-[#D9A441] text-[#1A0F0A] text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
              {customers.length} total
            </span>
          </div>
          <p className="text-xs text-[#8C7768] mt-1">
            All registered customer profiles, credentials status, and lifetime purchase metrics
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="btn-outline text-xs py-2 px-4 bg-white self-start sm:self-auto flex items-center gap-1.5 shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-[#8C7768] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#B8893C]/20 text-xs pl-9 pr-4 py-2 rounded-xl text-[#3A2A22] placeholder-[#8C7768]/60 focus:border-[#B8893C] outline-none"
          />
        </div>
      </div>

      {/* Customers Table */}
      {loading ? (
        <div className="bg-white border border-[#B8893C]/20 rounded-2xl p-12 text-center text-xs text-[#8C7768]">
          Loading customer directory...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#B8893C]/20 rounded-2xl p-12 text-center space-y-3">
          <Users className="w-8 h-8 text-[#8C7768] mx-auto opacity-40" />
          <p className="text-sm font-medium text-[#3A2A22]">No client records found</p>
          <p className="text-xs text-[#8C7768]">
            {search ? "No registrations match your search query." : "No client accounts registered yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#B8893C]/20 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#B8893C]/20 text-[#8C7768] uppercase bg-[#FAF6F0]/60">
                  <th className="p-4">Client Name &amp; Role</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Orders Placed</th>
                  <th className="p-4">Lifetime Spend</th>
                  <th className="p-4 text-right">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8893C]/10">
                {filtered.map((c) => {
                  const dateStr = new Date(c.registeredAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <tr key={c.id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#FAF6F0] border border-[#B8893C]/30 flex items-center justify-center text-[#3A2A22] font-semibold text-xs">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-[#3A2A22] block">
                              {c.name}
                            </span>
                            <span
                              className={`badge text-[9px] ${
                                c.role === "ADMIN" ? "badge-gold" : "badge-sand"
                              }`}
                            >
                              {c.role === "ADMIN" ? "Staff Admin" : "Customer"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-[#3A2A22]">
                        {c.email}
                      </td>

                      <td className="p-4 font-mono text-[#6B5548]">
                        {c.phone}
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-[#3A2A22]">
                          {c.totalOrders}
                        </span>
                        <span className="text-[#8C7768] ml-1">
                          {c.totalOrders === 1 ? "order" : "orders"}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-semibold text-[#3A2A22]">
                        {formatPrice(c.totalSpend)}
                      </td>

                      <td className="p-4 text-right font-mono text-[#8C7768]">
                        {dateStr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

