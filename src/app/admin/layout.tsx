"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/shared/Logo";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sliders,
  Flame,
  ArrowLeft,
  Gift,
  MessageSquare,
  Users,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?next=/admin");
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [status, session, router]);

  if (
    status === "loading" ||
    (status === "authenticated" && session?.user?.role !== "ADMIN")
  ) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#7A6255]">
          Verifying Atelier Credentials...
        </p>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products & Gift Tiers", href: "/admin/products", icon: Package },
    { name: "Reveal Codes", href: "/admin/reveal-codes", icon: Gift },
    { name: "Orders & Shipping", href: "/admin/orders", icon: ShoppingBag },
    { name: "Registered Clients", href: "/admin/customers", icon: Users },
    { name: "Customer Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Site Settings", href: "/admin/settings", icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#3A2A22] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#B8893C]/20 p-6 shrink-0 flex flex-col justify-between shadow-xs">
        <div>
          {/* Brand & Admin Badge */}
          <div className="flex flex-col gap-2 pb-6 border-b border-[#B8893C]/15 mb-6">
            <Logo variant="compact" theme="light" />
            <div className="flex items-center gap-2 mt-1">
              <span className="badge badge-gold text-[9px]">Staff Atelier</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#B8893C] text-white shadow-xs"
                      : "text-[#6B5548] hover:bg-[#FAF6F0] hover:text-[#3A2A22]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Return to Public Storefront */}
        <div className="pt-6 border-t border-[#B8893C]/15 mt-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[#8C7768] hover:text-[#B8893C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Store</span>
          </Link>
          <p className="text-[10px] text-[#8C7768] mt-2">
            Logged in: admin@{siteConfig.domain}
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
