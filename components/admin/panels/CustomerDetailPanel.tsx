"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import {
  Button, Card, PageHeader, Badge, StatusBadge, Spinner, ConfirmDialog,
} from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, ShieldOff, Shield, MapPin, ShoppingBag, User } from "lucide-react";
import toast from "react-hot-toast";
import theme from "@/theme";
import { useAdminTab } from "@/context/AdminTabContext";

export default function CustomerDetailPanel({ id }: { id: string }) {
  const { goBack, setTab } = useAdminTab();
  const { apiFetch } = useApi();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [blocking, setBlocking] = useState(false);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/admin/customers/${id}`);
      setCustomer(data?.customer || data);
    } catch (err) {
      toast.error("Failed to load customer");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomer(); }, [id]);

  const handleToggleBlock = async () => {
    setBlocking(true);
    try {
      await apiFetch(`/api/admin/customers/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked: !customer.isBlocked }),
      });
      setCustomer((prev: any) => ({ ...prev, isBlocked: !prev.isBlocked }));
      toast.success(customer.isBlocked ? "Customer unblocked" : "Customer blocked");
    } catch {
      toast.error("Failed to update customer");
    } finally {
      setBlocking(false);
      setShowBlockConfirm(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 gap-3">
      <Spinner size={32} />
      <p style={{ color: theme.colors.muted }} className="text-sm animate-pulse">Loading profile...</p>
    </div>
  );

  if (!customer) return (
    <div className="text-center py-24">
      <div style={{ backgroundColor: theme.colors.subtitle }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <User style={{ color: theme.colors.primary }} />
      </div>
      <h2 style={{ color: theme.colors.dark }} className="text-xl font-semibold">Customer not found</h2>
      <p style={{ color: theme.colors.muted }} className="text-sm mb-6">The profile you're looking for doesn't exist or has been removed.</p>
      <Button variant="outline" onClick={() => setTab("customers")}>Return to List</Button>
    </div>
  );

  const initials = (customer.displayName || customer.email || "?")[0]?.toUpperCase();

  return (
    <div className="max-w-[1100px] space-y-5">
      <PageHeader
        title={customer.displayName || customer.email || "Customer"}
        subtitle={customer.email}
        breadcrumb={["Admin", "Customers", "Detail"]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={goBack}>
              Back
            </Button>
            <Button
              variant={customer.isBlocked ? "secondary" : "danger"}
              size="sm"
              leftIcon={customer.isBlocked ? <Shield size={14} /> : <ShieldOff size={14} />}
              onClick={() => setShowBlockConfirm(true)}
            >
              {customer.isBlocked ? "Unblock" : "Block User"}
            </Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: theme.colors.muted + "30" }}>
              <ShoppingBag size={16} style={{ color: theme.colors.muted }} />
              <h3 style={{ color: theme.colors.dark }} className="font-semibold">Order History ({customer.orderCount ?? 0})</h3>
            </div>
            {(customer.orders ?? []).length === 0 ? (
              <div style={{ color: theme.colors.muted }} className="py-12 text-center text-sm">No orders yet.</div>
            ) : (
              <div className="divide-y" style={{ borderColor: theme.colors.muted + "20" }}>
                {customer.orders.map((o: any) => (
                  <button
                    key={o.id}
                    onClick={() => setTab("orders/detail", o.id)}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-black/[0.02] transition-colors text-left"
                  >
                    <div>
                      <p style={{ color: theme.colors.primary }} className="font-mono text-xs font-medium">{o.id.slice(0, 20)}…</p>
                      <p style={{ color: theme.colors.muted }} className="text-xs mt-0.5">{formatDate(o.createdAt)} · {o.items?.length ?? 0} items</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ color: theme.colors.dark }} className="font-semibold text-sm">{formatCurrency(o.total)}</span>
                      <StatusBadge status={o.status} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {(customer.addresses ?? []).length > 0 && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} style={{ color: theme.colors.muted }} />
                <h3 style={{ color: theme.colors.dark }} className="font-semibold">Saved Addresses</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {customer.addresses.map((addr: any) => (
                  <div key={addr.id} style={{ borderColor: theme.colors.muted + "40" }} className="border rounded-xl p-4 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span style={{ color: theme.colors.dark }} className="font-medium">{addr.label}</span>
                      {addr.isDefault && <Badge variant="purple">Default</Badge>}
                    </div>
                    <div style={{ color: theme.colors.muted }} className="space-y-0.5">
                      <p>{addr.line1}</p>
                      {addr.line2 && <p>{addr.line2}</p>}
                      <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                      <p>{addr.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex flex-col items-center gap-3 mb-5">
              <div
                style={{ backgroundColor: theme.colors.subtitle, color: theme.colors.primary }}
                className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shadow-sm"
              >
                {initials}
              </div>
              <div className="text-center">
                <p style={{ color: theme.colors.dark }} className="font-semibold text-lg">{customer.displayName || "Anonymous"}</p>
                <p style={{ color: theme.colors.muted }} className="text-sm">{customer.email}</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Badge variant={customer.isBlocked ? "error" : "success"}>{customer.isBlocked ? "Blocked" : "Active"}</Badge>
                  <Badge variant="default" className="capitalize">{customer.provider || "email"}</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3 text-sm border-t pt-4" style={{ borderColor: theme.colors.muted + "30" }}>
              {[
                { label: "Phone",      value: customer.phoneNumber || "—" },
                { label: "Joined",     value: formatDate(customer.createdAt) },
                { label: "Last Login", value: formatDate(customer.updatedAt) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span style={{ color: theme.colors.muted }}>{label}</span>
                  <span style={{ color: theme.colors.dark }} className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 style={{ color: theme.colors.dark }} className="font-semibold mb-4 text-sm uppercase tracking-wider">Customer Stats</h3>
            <div className="space-y-4">
              {[
                { label: "Total Orders",    value: customer.orderCount ?? 0,               color: theme.colors.dark },
                { label: "Lifetime Value",  value: formatCurrency(customer.totalSpent ?? 0), color: "#166534" },
                { label: "Wishlist Items",  value: (customer.wishlist ?? []).length,         color: theme.colors.dark },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center pb-2 border-b last:border-0" style={{ borderColor: theme.colors.muted + "20" }}>
                  <span style={{ color: theme.colors.muted }} className="text-sm">{label}</span>
                  <span style={{ color }} className="text-sm font-bold">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showBlockConfirm}
        onClose={() => setShowBlockConfirm(false)}
        onConfirm={handleToggleBlock}
        loading={blocking}
        title={customer.isBlocked ? "Unblock Customer" : "Block Customer"}
        description={
          customer.isBlocked
            ? `Re-enable access for ${customer.email}?`
            : `Block ${customer.email}? This user will be immediately logged out and unable to return.`
        }
        confirmText={customer.isBlocked ? "Unblock" : "Block"}
        variant={customer.isBlocked ? "primary" : "danger"}
      />
    </div>
  );
}
