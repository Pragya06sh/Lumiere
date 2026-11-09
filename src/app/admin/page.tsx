import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Flame,
  TrendingUp,
  Package,
  Gift,
  Inbox,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let revenueTodayPaise = 0;
  let revenueYesterdayPaise = 0;
  let revenueTodayCount = 0;
  let revenueMonthPaise = 0;
  let revenueMonthCount = 0;
  let activeOrdersCount = 0;
  let lowStockCount = 0;
  let lowStockVariants: Array<{
    id: string;
    productName: string;
    variantName: string;
    stock: number;
    price: number;
  }> = [];
  let topProducts: Array<{
    name: string;
    totalQuantity: number;
    totalRevenue: number;
    burnTime?: string | null;
    price: number;
  }> = [];

  try {
    // 1. Revenue Today (paid orders only, exclude cancelled/failed)
    const paidToday = await prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
        status: { notIn: ["CANCELLED", "FAILED"] },
        createdAt: { gte: todayStart },
      },
      select: { total: true },
    });
    revenueTodayPaise = paidToday.reduce((sum, o) => sum + o.total, 0);
    revenueTodayCount = paidToday.length;

    // Yesterday's revenue for real percentage comparison
    const paidYesterday = await prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
        status: { notIn: ["CANCELLED", "FAILED"] },
        createdAt: { gte: yesterdayStart, lt: todayStart },
      },
      select: { total: true },
    });
    revenueYesterdayPaise = paidYesterday.reduce((sum, o) => sum + o.total, 0);

    // 2. Revenue Month to Date (paid orders only, exclude cancelled/failed)
    const paidMonth = await prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
        status: { notIn: ["CANCELLED", "FAILED"] },
        createdAt: { gte: monthStart },
      },
      select: { total: true },
    });
    revenueMonthPaise = paidMonth.reduce((sum, o) => sum + o.total, 0);
    revenueMonthCount = paidMonth.length;

    // 3. Active Orders: paid or placed (COD) and not yet delivered/cancelled/failed
    activeOrdersCount = await prisma.order.count({
      where: {
        OR: [
          { paymentStatus: "PAID" },
          { paymentMethod: "COD", status: { notIn: ["CANCELLED", "FAILED"] } },
        ],
        status: { notIn: ["DELIVERED", "CANCELLED", "FAILED"] },
      },
    });

    // 4. Low Stock: variants with stock under/at 25 units
    lowStockCount = await prisma.variant.count({
      where: { stock: { lte: 25 } },
    });

    const dbLowStock = await prisma.variant.findMany({
      where: { stock: { lte: 25 } },
      include: { product: true },
      orderBy: { stock: "asc" },
      take: 10,
    });

    lowStockVariants = dbLowStock.map((v) => ({
      id: v.id,
      productName: v.product?.name || "Product",
      variantName: v.name,
      stock: v.stock,
      price: v.price,
    }));

    // 5. Top Performing: products ranked by quantity sold in real orders
    const paidOrderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          OR: [
            { paymentStatus: "PAID" },
            { paymentMethod: "COD", status: { notIn: ["CANCELLED", "FAILED"] } },
          ],
          status: { notIn: ["CANCELLED", "FAILED"] },
        },
      },
      include: {
        product: {
          include: {
            variants: true,
          },
        },
      },
    });

    const salesMap = new Map<
      string,
      {
        name: string;
        totalQuantity: number;
        totalRevenue: number;
        burnTime?: string | null;
        price: number;
      }
    >();

    for (const item of paidOrderItems) {
      const key = item.productId || item.name;
      const existing = salesMap.get(key);
      if (existing) {
        existing.totalQuantity += item.quantity;
        existing.totalRevenue += item.total;
      } else {
        salesMap.set(key, {
          name: item.name,
          totalQuantity: item.quantity,
          totalRevenue: item.total,
          burnTime: item.product?.burnTime,
          price: item.product?.variants[0]?.price || item.price,
        });
      }
    }

    topProducts = Array.from(salesMap.values())
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);
  } catch (error) {
    console.error("Failed to load dashboard metrics from Prisma:", error);
  }

  // Calculate real percentage vs yesterday only if real data exists
  let revenueTodayComparison: string | null = null;
  if (revenueYesterdayPaise > 0) {
    const change = Math.round(
      ((revenueTodayPaise - revenueYesterdayPaise) / revenueYesterdayPaise) * 100
    );
    revenueTodayComparison = `${change >= 0 ? "+" : ""}${change}% vs yesterday`;
  } else if (revenueTodayCount > 0) {
    revenueTodayComparison = `${revenueTodayCount} order${revenueTodayCount > 1 ? "s" : ""} today`;
  } else {
    revenueTodayComparison = "No sales recorded today";
  }

  const monthSubtitle =
    revenueMonthCount > 0
      ? `${revenueMonthCount} paid order${revenueMonthCount > 1 ? "s" : ""} this month`
      : "No paid orders this month";

  const activeOrdersSubtitle =
    activeOrdersCount > 0
      ? `${activeOrdersCount} order${activeOrdersCount > 1 ? "s" : ""} pending delivery`
      : "No active orders pending delivery";

  const lowStockSubtitle =
    lowStockCount > 0
      ? `${lowStockCount} SKU${lowStockCount > 1 ? "s" : ""} under 25 units`
      : "All inventory levels healthy";

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B8893C]/20 pb-5">
        <div>
          <span className="text-xs text-[#B8893C] uppercase tracking-wider block mb-1">
            Studio Operations Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-display text-[#3A2A22] font-medium">
            Store & Gifting Dashboard
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/products"
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-xs"
          >
            <Package className="w-4 h-4" />
            <span>Manage Catalog</span>
          </Link>
          <Link
            href="/admin/reveal-codes"
            className="btn-outline bg-white text-xs py-2 px-4 flex items-center gap-1.5 shadow-xs"
          >
            <Gift className="w-4 h-4 text-[#E8A33D]" />
            <span>Reveal Codes</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales Today */}
        <div className="bg-white border border-[#B8893C]/20 p-5 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#8C7768] text-xs">
            <span>Revenue Today</span>
            <TrendingUp className="w-4 h-4 text-[#B8893C]" />
          </div>
          <p className="font-display text-2xl md:text-3xl text-[#3A2A22] font-semibold">
            {formatPrice(revenueTodayPaise)}
          </p>
          <span className="text-[11px] text-[#8C7768] block">
            {revenueTodayComparison}
          </span>
        </div>

        {/* Sales Month */}
        <div className="bg-white border border-[#B8893C]/20 p-5 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#8C7768] text-xs">
            <span>Month to Date</span>
            <DollarSign className="w-4 h-4 text-[#E8A33D]" />
          </div>
          <p className="font-display text-2xl md:text-3xl text-[#3A2A22] font-semibold">
            {formatPrice(revenueMonthPaise)}
          </p>
          <span className="text-[11px] text-[#6B5548] block">
            {monthSubtitle}
          </span>
        </div>

        {/* Orders Count */}
        <div className="bg-white border border-[#B8893C]/20 p-5 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#8C7768] text-xs">
            <span>Active Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#C98B6B]" />
          </div>
          <p className="font-display text-2xl md:text-3xl text-[#3A2A22] font-semibold">
            {activeOrdersCount} {activeOrdersCount === 1 ? "Order" : "Orders"}
          </p>
          <span className="text-[11px] text-[#C98B6B] block">
            {activeOrdersSubtitle}
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-[#B8893C]/20 p-5 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-[#8C7768] text-xs">
            <span>Low Stock SKUs</span>
            <AlertTriangle className="w-4 h-4 text-[#C98B6B]" />
          </div>
          <p className="font-display text-2xl md:text-3xl text-[#C98B6B] font-semibold">
            {lowStockCount} {lowStockCount === 1 ? "SKU" : "SKUs"}
          </p>
          <span className="text-[11px] text-[#8C7768] block">
            {lowStockSubtitle}
          </span>
        </div>
      </div>

      {/* Two Column Layout: Low Stock Alert Table + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Low Stock Watch */}
        <div className="lg:col-span-7 bg-white border border-[#B8893C]/20 p-6 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#B8893C]/15 pb-3">
            <h3 className="font-display text-base text-[#3A2A22] font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#C98B6B]" />
              <span>Low Inventory Warning (Under 25 units)</span>
            </h3>
            <span className="text-xs text-[#8C7768]">
              {lowStockVariants.length} listed
            </span>
          </div>

          {lowStockVariants.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#B8893C] mx-auto opacity-70" />
              <p className="text-sm font-medium text-[#3A2A22]">
                All stock levels healthy
              </p>
              <p className="text-xs text-[#8C7768]">
                No product variants are currently below 25 units in the database.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#B8893C]/15 text-[#8C7768] uppercase">
                    <th className="pb-2">Candle Name</th>
                    <th className="pb-2">Variant</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2 text-right">Units Left</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B8893C]/10">
                  {lowStockVariants.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAF6F0]/40">
                      <td className="py-2.5 font-medium text-[#3A2A22]">
                        {item.productName}
                      </td>
                      <td className="py-2.5 text-[#8C7768]">
                        {item.variantName}
                      </td>
                      <td className="py-2.5 text-[#3A2A22]">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-2.5 text-right font-medium text-[#C98B6B]">
                        {item.stock} left
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Performing Editions */}
        <div className="lg:col-span-5 bg-white border border-[#B8893C]/20 p-6 rounded-2xl space-y-4 shadow-xs">
          <div className="border-b border-[#B8893C]/15 pb-3 flex items-center justify-between">
            <h3 className="font-display text-base text-[#3A2A22] flex items-center gap-2 font-medium">
              <Flame className="w-4 h-4 text-[#E8A33D]" />
              <span>Top Performing Editions</span>
            </h3>
            <span className="text-xs text-[#8C7768]">By Units Sold</span>
          </div>

          {topProducts.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Inbox className="w-8 h-8 text-[#8C7768] mx-auto opacity-50" />
              <p className="text-sm font-medium text-[#3A2A22]">
                No sales recorded yet
              </p>
              <p className="text-xs text-[#8C7768] max-w-xs mx-auto">
                Once customer orders are paid, candles ranked by real units sold
                will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, idx) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between p-3 bg-[#FAF6F0] border border-[#B8893C]/15 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#B8893C] w-5">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-medium text-[#3A2A22]">
                        {p.name}
                      </h4>
                      {p.burnTime && (
                        <p className="text-[10px] text-[#8C7768]">
                          {p.burnTime}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#3A2A22] block font-semibold">
                      {p.totalQuantity} sold
                    </span>
                    <span className="text-[10px] text-[#8C7768]">
                      {formatPrice(p.totalRevenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
