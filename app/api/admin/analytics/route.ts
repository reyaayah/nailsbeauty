import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin, isNextResponse } from "@/lib/requireAdmin";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (isNextResponse(auth)) return auth;

  try {
    const [ordersSnap, usersSnap, productsSnap] = await Promise.all([
      adminDb.collection("orders").orderBy("createdAt", "desc").get(),
      adminDb.collection("users").get(),
      adminDb.collection("products").get(),
    ]);

    const now = Date.now();
    const orders = ordersSnap.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt ?? now),
      };
    });

    const activeOrders = orders.filter((o: any) => o.status !== "cancelled");
    const totalRevenue = activeOrders.reduce((s: number, o: any) => s + (o.total ?? 0), 0);

    // Last 30 days revenue per day
    const revenueByDay: Record<string, { revenue: number; orders: number }> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      revenueByDay[key] = { revenue: 0, orders: 0 };
    }
    activeOrders.forEach((o: any) => {
      const key = o.createdAt instanceof Date
        ? o.createdAt.toISOString().slice(0, 10)
        : String(o.createdAt).slice(0, 10);
      if (revenueByDay[key]) {
        revenueByDay[key].revenue += o.total ?? 0;
        revenueByDay[key].orders += 1;
      }
    });

    // Orders by status
    const statusCount: Record<string, number> = {
      pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0,
    };
    orders.forEach((o: any) => {
      if (statusCount[o.status] !== undefined) statusCount[o.status]++;
    });

    // Top products
    const productRevenue: Record<string, { name: string; sold: number; revenue: number }> = {};
    activeOrders.forEach((o: any) => {
      (o.items ?? []).forEach((item: any) => {
        const k = String(item.productId ?? item.name);
        if (!productRevenue[k]) productRevenue[k] = { name: item.name, sold: 0, revenue: 0 };
        productRevenue[k].sold += item.quantity ?? 1;
        productRevenue[k].revenue += (item.price ?? 0) * (item.quantity ?? 1);
      });
    });
    const topProducts = Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Growth (compare last 7 days vs prior 7)
    const last7 = activeOrders.filter((o: any) => {
      const d = o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt);
      return now - d.getTime() < 7 * 86400000;
    });
    const prior7 = activeOrders.filter((o: any) => {
      const d = o.createdAt instanceof Date ? o.createdAt : new Date(o.createdAt);
      const age = now - d.getTime();
      return age >= 7 * 86400000 && age < 14 * 86400000;
    });
    const last7Rev = last7.reduce((s: number, o: any) => s + (o.total ?? 0), 0);
    const prior7Rev = prior7.reduce((s: number, o: any) => s + (o.total ?? 0), 0);
    const revenueGrowth = prior7Rev === 0 ? 100 : Math.round(((last7Rev - prior7Rev) / prior7Rev) * 100);
    const ordersGrowth = prior7.length === 0 ? 100 : Math.round(((last7.length - prior7.length) / prior7.length) * 100);

    // Recent orders
    const recentOrders = ordersSnap.docs.slice(0, 5).map((d) => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        createdAt: data.createdAt?.toDate?.().toISOString() ?? data.createdAt,
        updatedAt: data.updatedAt?.toDate?.().toISOString() ?? data.updatedAt,
      };
    });

    return NextResponse.json({
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: usersSnap.size,
      totalProducts: productsSnap.size,
      revenueGrowth,
      ordersGrowth,
      revenueByDay: Object.entries(revenueByDay).map(([date, v]) => ({ date, ...v })),
      ordersByStatus: Object.entries(statusCount).map(([status, count]) => ({ status, count })),
      topProducts,
      recentOrders,
    });
  } catch (err) {
    console.error("GET /api/admin/analytics:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
