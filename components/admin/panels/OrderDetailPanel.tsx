"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Order, OrderStatus } from "@/types";
import {
  Button, Card, PageHeader, StatusBadge, Select, Input, Spinner,
} from "@/components/ui";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { ArrowLeft, MapPin, CreditCard, Package2, CheckCircle2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useAdminTab } from "@/context/AdminTabContext";

const STEPS: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];
const STATUS_OPTIONS = [
  { value: "pending",   label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped",   label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrderDetailPanel({ id }: { id: string }) {
  const { goBack } = useAdminTab();
  const { apiFetch } = useApi();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>("pending");
  const [tracking, setTracking] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    apiFetch(`/api/admin/orders/${id}`)
      .then((data) => {
        setOrder(data);
        setNewStatus(data.status ?? "pending");
        setTracking(data.trackingNumber ?? "");
        setNotes(data.notes ?? "");
      })
      .catch(() => toast.error("Failed to load order"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus, trackingNumber: tracking, notes }),
      });
      setOrder((prev) => prev ? { ...prev, status: newStatus, trackingNumber: tracking, notes } : prev);
      toast.success("Order updated!");
    } catch {
      toast.error("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size={28} /></div>;
  if (!order)  return <div className="text-center py-20 text-slate-500">Order not found.</div>;

  const currentStepIdx = STEPS.indexOf(order.status as OrderStatus);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="max-w-[1100px] space-y-5">
      <PageHeader
        title={`Order #${order.id.slice(0, 16)}…`}
        subtitle={`Placed ${formatDateTime(order.createdAt)}`}
        breadcrumb={["Admin", "Orders", "Detail"]}
        actions={
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={goBack}>
            Back
          </Button>
        }
      />

      {!isCancelled && (
        <Card className="p-5">
          <div className="flex items-center gap-0">
            {STEPS.map((step, i) => {
              const done   = i <= currentStepIdx;
              const active = i === currentStepIdx;
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all z-10",
                      done ? "border-[--accent] bg-[--accent]" : "border-slate-200 bg-white"
                    )}>
                      {done
                        ? <CheckCircle2 size={16} className="text-white" />
                        : <span className="text-xs font-bold text-slate-300">{i + 1}</span>
                      }
                    </div>
                    <p className={cn("text-xs mt-1.5 font-medium capitalize", active ? "text-[--accent]" : done ? "text-slate-700" : "text-slate-300")}>
                      {step}
                    </p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cn("flex-1 h-0.5 mx-1 -mt-4", i < currentStepIdx ? "bg-[--accent]" : "bg-slate-200")} />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[--border]">
              <Package2 size={16} className="text-slate-500" />
              <h3 className="font-semibold text-slate-900">Order Items ({order.items?.length ?? 0})</h3>
            </div>
            <div className="divide-y divide-[--border]">
              {(order.items ?? []).map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-[--border] flex-shrink-0" onError={(e) => (e.currentTarget.style.display = "none")} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.shape && `Shape: ${item.shape}`}{item.size && ` · Size: ${item.size}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-xs text-slate-400">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-[--border] space-y-2">
              <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between text-sm text-slate-600"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}</span></div>
              <div className="flex justify-between font-semibold text-slate-900 pt-2 border-t border-[--border]"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-slate-500" />
              <h3 className="font-semibold text-slate-900">Shipping Address</h3>
            </div>
            {order.shippingAddress ? (
              <div className="text-sm text-slate-600 space-y-1">
                <p className="font-medium text-slate-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No address provided</p>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Update Order</h3>
            <Select label="Status" options={STATUS_OPTIONS} value={newStatus} onChange={(e) => setNewStatus(e.target.value as OrderStatus)} />
            <Input label="Tracking Number" placeholder="e.g. 1Z999AA10123456784" value={tracking} onChange={(e) => setTracking(e.target.value)} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Internal Notes</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2.5 text-sm border border-[--border] rounded-xl outline-none focus:border-[--accent] focus:ring-2 focus:ring-[--accent]/20 resize-none"
                placeholder="Notes visible only to admins…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button className="w-full" leftIcon={<Save size={14} />} onClick={handleSave} loading={saving}>
              Save Changes
            </Button>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-slate-500" />
              <h3 className="font-semibold text-slate-900">Payment & Customer</h3>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: "Payment",  value: order.paymentMethod || "—" },
                { label: "Status",   value: <StatusBadge status={order.status} /> },
                { label: "Customer", value: (order as any).userEmail || "—" },
                { label: "Name",     value: (order as any).userName || order.shippingAddress?.fullName || "—" },
                { label: "User ID",  value: <span className="font-mono text-xs break-all">{order.userId}</span> },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-3">
                  <span className="text-slate-400 flex-shrink-0">{label}</span>
                  <span className="text-slate-700 text-right">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Timeline</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Created</span><span className="text-slate-700">{formatDate(order.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Updated</span><span className="text-slate-700">{formatDate(order.updatedAt)}</span></div>
              {order.trackingNumber && (
                <div className="flex justify-between"><span className="text-slate-400">Tracking</span><span className="font-mono text-xs text-[--accent]">{order.trackingNumber}</span></div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
