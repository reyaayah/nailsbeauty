"use client";
import { useAdminTab } from "@/context/AdminTabContext";

// Section panels — copied verbatim from the old route pages,
// but with router.push / router.back replaced by setTab / goBack.
import DashboardPanel   from "@/components/admin/panels/DashboardPanel";
import ProductsPanel    from "@/components/admin/panels/ProductsPanel";
import ProductNewPanel  from "@/components/admin/panels/ProductNewPanel";
import ProductEditPanel from "@/components/admin/panels/ProductEditPanel";
import OrdersPanel      from "@/components/admin/panels/OrdersPanel";
import OrderDetailPanel from "@/components/admin/panels/OrderDetailPanel";
import CustomersPanel   from "@/components/admin/panels/CustomersPanel";
import CustomerDetailPanel from "@/components/admin/panels/CustomerDetailPanel";
import CollectionsPanel from "@/components/admin/panels/CollectionsPanel";
import BlogPanel        from "@/components/admin/panels/BlogPanel";
import SettingsPanel    from "@/components/admin/panels/SettingsPanel";

export default function AdminPage() {
  const { activeTab, selectedId } = useAdminTab();

  switch (activeTab) {
    case "dashboard":        return <DashboardPanel />;
    case "products":         return <ProductsPanel />;
    case "products/new":     return <ProductNewPanel />;
    case "products/edit":    return <ProductEditPanel id={selectedId!} />;
    case "orders":           return <OrdersPanel />;
    case "orders/detail":    return <OrderDetailPanel id={selectedId!} />;
    case "customers":        return <CustomersPanel />;
    case "customers/detail": return <CustomerDetailPanel id={selectedId!} />;
    case "collections":      return <CollectionsPanel />;
    case "blog":             return <BlogPanel />;
    case "settings":         return <SettingsPanel />;
    default:                 return <DashboardPanel />;
  }
}
