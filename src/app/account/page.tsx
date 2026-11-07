"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Package,
  MapPin,
  User,
  LogOut,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  Heart,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

function AccountDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "orders";

  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile" | "wishlist">(
    (initialTab as any) || "orders"
  );
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?next=/account");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/account/orders")
        .then((res) => res.json())
        .then((data) => {
          setOrders(data.orders || []);
          setLoadingOrders(false);
        })
        .catch(() => setLoadingOrders(false));

      fetch("/api/account/profile")
        .then((res) => res.json())
        .then((data) => {
          setProfile(data.user || null);
          setLoadingProfile(false);
        })
        .catch(() => setLoadingProfile(false));
    }
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Sparkles className="w-6 h-6 text-[#D9A441] animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#7A6255]">
            Accessing Client Atelier...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="border-b border-[#E6D8C6] pb-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] bg-[#2A1B15]/5 text-[#A8742A] border border-[#D9A441]/30 font-medium mb-2">
              <Sparkles className="w-3 h-3 text-[#D9A441]" />
              Client Sanctuary
            </span>
            <h1
              className="text-3xl sm:text-4xl font-serif font-medium text-[#2A1B15] tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              My Account
            </h1>
            <p className="text-sm text-[#7A6255] mt-1">
              Welcome, {session?.user?.name || session?.user?.email}
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="self-start md:self-auto inline-flex items-center gap-2 py-2 px-5 bg-white border border-[#E6D8C6] hover:border-[#9A3B26] hover:text-[#9A3B26] text-[#5C463B] text-xs uppercase tracking-[0.15em] font-medium rounded-full transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <div className="md:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs uppercase tracking-[0.15em] font-medium transition-all ${
                activeTab === "orders"
                  ? "bg-[#2A1B15] text-[#FAF6F0] shadow-xs"
                  : "bg-white text-[#5C463B] hover:bg-[#FAF6F0] border border-[#E6D8C6]"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                Orders
              </span>
              <span className="text-[11px] font-mono opacity-80">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs uppercase tracking-[0.15em] font-medium transition-all ${
                activeTab === "addresses"
                  ? "bg-[#2A1B15] text-[#FAF6F0] shadow-xs"
                  : "bg-white text-[#5C463B] hover:bg-[#FAF6F0] border border-[#E6D8C6]"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                Addresses
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs uppercase tracking-[0.15em] font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-[#2A1B15] text-[#FAF6F0] shadow-xs"
                  : "bg-white text-[#5C463B] hover:bg-[#FAF6F0] border border-[#E6D8C6]"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                Profile
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <Link
              href="/shop"
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs uppercase tracking-[0.15em] font-medium bg-white text-[#5C463B] hover:bg-[#FAF6F0] border border-[#E6D8C6] transition-all"
            >
              <span className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-[#D9A441]" />
                Wishlist & Shop
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <div className="pt-4">
              <Link
                href="/track-order"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#FAF6F0] border border-[#D9A441]/40 text-[#A8742A] text-xs uppercase tracking-[0.15em] font-medium rounded-full hover:bg-white transition-colors"
              >
                <Truck className="w-3.5 h-3.5" />
                Track an Order
              </Link>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h2 className="text-xl font-serif font-medium text-[#2A1B15]">
                  Order History
                </h2>

                {loadingOrders ? (
                  <div className="bg-white border border-[#E6D8C6] rounded-2xl p-12 text-center text-sm text-[#7A6255]">
                    Loading your candle orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white border border-[#E6D8C6] rounded-2xl p-12 text-center space-y-4">
                    <Package className="w-10 h-10 text-[#D9A441] mx-auto opacity-70" />
                    <p className="text-base text-[#2A1B15] font-serif font-medium">
                      No orders placed yet
                    </p>
                    <p className="text-xs text-[#7A6255] max-w-sm mx-auto">
                      Explore our handcrafted collections and discover a sealed keepsake waiting at the end of the flame.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 py-2.5 px-6 bg-[#2A1B15] hover:bg-[#3D2820] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium rounded-full transition-all"
                      >
                        Explore Collection
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white border border-[#E6D8C6] rounded-2xl p-6 shadow-xs space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#FAF6F0] pb-4">
                          <div>
                            <span className="text-xs font-mono font-bold text-[#2A1B15]">
                              Order #{order.orderNumber}
                            </span>
                            <span className="text-xs text-[#9C8578] ml-3">
                              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-[#FAF6F0] border border-[#E6D8C6] text-[#5C463B] text-[11px] uppercase tracking-[0.15em] rounded-full font-medium">
                              {order.status}
                            </span>
                            <span className="text-sm font-semibold text-[#2A1B15]">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="space-y-2">
                          {order.items?.map((item: any) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between text-xs text-[#5C463B]"
                            >
                              <span>
                                {item.productName} ({item.variantName}) × {item.quantity}
                              </span>
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Reveal Code button if present */}
                        {order.items?.some((it: any) => it.revealCodes?.length > 0) && (
                          <div className="bg-[#FAF6F0] border border-[#D9A441]/40 rounded-xl p-3 flex items-center justify-between">
                            <div className="text-xs">
                              <span className="text-[#A8742A] font-medium">
                                Keepsake Reveal Code:{" "}
                              </span>
                              <span className="font-mono font-bold text-[#2A1B15]">
                                {order.items.flatMap((it: any) => it.revealCodes || [])[0]?.code}
                              </span>
                            </div>
                            <Link
                              href={`/reveal/${order.items.flatMap((it: any) => it.revealCodes || [])[0]?.code}`}
                              className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-[#2A1B15] font-semibold hover:text-[#A8742A]"
                            >
                              Reveal Keepsake
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <h2 className="text-xl font-serif font-medium text-[#2A1B15]">
                  Saved Shipping Addresses
                </h2>

                {loadingProfile ? (
                  <div className="bg-white border border-[#E6D8C6] rounded-2xl p-12 text-center text-sm text-[#7A6255]">
                    Loading addresses...
                  </div>
                ) : profile?.addresses?.length === 0 ? (
                  <div className="bg-white border border-[#E6D8C6] rounded-2xl p-10 text-center space-y-3">
                    <MapPin className="w-8 h-8 text-[#D9A441] mx-auto opacity-70" />
                    <p className="text-sm text-[#5C463B]">
                      No saved addresses. Your delivery addresses will be saved automatically upon checkout.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile?.addresses?.map((addr: any) => (
                      <div
                        key={addr.id}
                        className="bg-white border border-[#E6D8C6] rounded-2xl p-5 shadow-xs space-y-1.5 text-xs text-[#5C463B]"
                      >
                        <p className="font-semibold text-sm text-[#2A1B15]">{addr.name}</p>
                        <p>{addr.line1}</p>
                        {addr.line2 && <p>{addr.line2}</p>}
                        <p>
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-[#9C8578] pt-1">Phone: {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-serif font-medium text-[#2A1B15]">
                  Profile Details
                </h2>

                <div className="bg-white border border-[#E6D8C6] rounded-2xl p-6 sm:p-8 space-y-4 max-w-md">
                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.15em] text-[#9C8578] font-medium">
                      Full Name
                    </span>
                    <p className="text-sm font-medium text-[#2A1B15] mt-0.5">
                      {profile?.name || session?.user?.name || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.15em] text-[#9C8578] font-medium">
                      Email Address
                    </span>
                    <p className="text-sm font-medium text-[#2A1B15] mt-0.5">
                      {profile?.email || session?.user?.email}
                    </p>
                  </div>

                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.15em] text-[#9C8578] font-medium">
                      Phone Number
                    </span>
                    <p className="text-sm font-medium text-[#2A1B15] mt-0.5">
                      {profile?.phone || (session?.user as any)?.phone || "Not provided"}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] bg-[#FAF6F0] text-[#A8742A] border border-[#D9A441]/30 font-medium">
                      Role: {profile?.role || "CUSTOMER"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0]" />}>
      <AccountDashboard />
    </Suspense>
  );
}

