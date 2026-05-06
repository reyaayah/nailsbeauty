"use client";
import { forwardRef, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ─── Button ────────────────────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {

    // Theme-mapped variants
    const variants = {
      primary: { backgroundColor: theme.colors.primary, color: theme.colors.light },
      secondary: { backgroundColor: theme.colors.subtitle, color: theme.colors.dark },
      ghost: { color: theme.colors.dark },
      danger: { backgroundColor: theme.colors.pink, color: theme.colors.light },
      outline: { border: `1px solid ${theme.colors.muted}`, color: theme.colors.dark },
    };

    const s = {
      xs: "h-7 px-2.5 text-xs gap-1.5 rounded-lg",
      sm: "h-8 px-3 text-sm gap-1.5 rounded-lg",
      md: "h-9 px-4 text-sm gap-2 rounded-xl",
      lg: "h-11 px-5 text-base gap-2 rounded-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={variants[variant]}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none hover:opacity-90",
          variant === 'ghost' && "hover:bg-black/5",
          s[size], className
        )}
        {...props}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";

// ─── Input ────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  inputPrefix?: ReactNode;
  inputSuffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, inputPrefix, inputSuffix, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} style={{ color: theme.colors.dark }} className="text-sm font-medium">
            {label}{props.required && <span style={{ color: theme.colors.pink }} className="ml-0.5">*</span>}
          </label>
        )}
        <div
          style={{ borderColor: error ? theme.colors.pink : theme.colors.muted, backgroundColor: theme.colors.light }}
          className={cn("flex items-center border rounded-xl transition-all focus-within:ring-2",
            error ? "ring-red-200" : "ring-primary/10"
          )}
        >
          {inputPrefix && <span style={{ color: theme.colors.muted }} className="pl-3 text-sm flex-shrink-0">{inputPrefix}</span>}
          <input
            ref={ref}
            id={inputId}
            style={{ color: theme.colors.dark }}
            className={cn("flex-1 h-10 px-3 text-sm placeholder-muted bg-transparent outline-none", className)}
            {...props}
          />
          {inputSuffix && <span style={{ color: theme.colors.muted }} className="pr-3 text-sm flex-shrink-0">{inputSuffix}</span>}
        </div>
        {error && <p style={{ color: theme.colors.pink }} className="text-xs">{error}</p>}
        {hint && !error && <p style={{ color: theme.colors.muted }} className="text-xs">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// ─── Textarea ─────────────────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            style={{ color: theme.colors.dark }}
            className="text-sm font-medium"
          >
            {label}{props.required && <span style={{ color: theme.colors.pink }} className="ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          style={{
            backgroundColor: theme.colors.light,
            borderColor: error ? theme.colors.pink : theme.colors.muted,
            color: theme.colors.dark
          }}
          className={cn(
            "w-full px-3 py-2.5 text-sm outline-none resize-none transition-all rounded-xl border focus:ring-2",
            error ? "ring-red-200" : "focus:ring-primary/10",
            className
          )}
          {...props}
        />
        {error && <p style={{ color: theme.colors.pink }} className="text-xs">{error}</p>}
        {hint && !error && <p style={{ color: theme.colors.muted }} className="text-xs">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// ─── Select ───────────────────────────────────────────────────────────────
// ─── Select ───────────────────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, placeholder, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            style={{ color: theme.colors.dark }}
            className="text-sm font-medium"
          >
            {label}{props.required && <span style={{ color: theme.colors.pink }} className="ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            style={{
              backgroundColor: theme.colors.light,
              borderColor: error ? theme.colors.pink : theme.colors.muted,
              color: theme.colors.dark
            }}
            className={cn(
              "w-full h-10 px-3 pr-10 text-sm border rounded-xl outline-none appearance-none cursor-pointer transition-all focus:ring-2",
              error ? "ring-red-100" : "focus:ring-primary/10",
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Custom Chevron Icon */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.colors.muted}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {error && <p style={{ color: theme.colors.pink }} className="text-xs">{error}</p>}
        {hint && !error && <p style={{ color: theme.colors.muted }} className="text-xs">{hint}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
// ─── Toggle ───────────────────────────────────────────────────────────────
// ─── Toggle ───────────────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  size?: "sm" | "md";
}

export function Toggle({ checked, onChange, label, size = "md" }: ToggleProps) {
  const w = size === "sm" ? "w-8 h-4" : "w-11 h-6";
  const dot = size === "sm" ? "w-3 h-3 top-0.5 left-0.5" : "w-5 h-5 top-0.5 left-0.5";
  const tx = size === "sm" ? "translate-x-4" : "translate-x-5";

  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          backgroundColor: checked ? theme.colors.primary : theme.colors.muted
        }}
        className={cn(
          "relative rounded-full transition-colors duration-200 flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          w
        )}

      >
        <span
          style={{ backgroundColor: theme.colors.light }}
          className={cn(
            "absolute rounded-full shadow transition-transform duration-200",
            dot,
            checked && tx
          )}
        />
      </button>
      {label && (
        <span
          style={{ color: theme.colors.dark }}
          className="text-sm font-medium"
        >
          {label}
        </span>
      )}
    </label>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "purple";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const v = {
    default: { backgroundColor: theme.colors.subtitle, color: theme.colors.dark },
    success: { backgroundColor: "#DCFCE7", color: "#166534" },
    warning: { backgroundColor: "#FEF3C7", color: "#92400E" },
    error: { backgroundColor: "#FEE2E2", color: theme.colors.pink },
    info: { backgroundColor: "#DBEAFE", color: "#1E40AF" },
    purple: { backgroundColor: "#F3E8FF", color: "#6B21A8" },
  };
  return (
    <span
      style={v[variant]}
      className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium", className)}
    >
      {children}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────
interface CardProps { children: ReactNode; className?: string; }
export function Card({ children, className }: CardProps) {
  return (
    <div
      style={{ backgroundColor: theme.colors.light, borderColor: theme.colors.muted }}
      className={cn("border rounded-2xl shadow-sm", className)}
    >
      {children}
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return <Loader2 size={size} style={{ color: theme.colors.primary }} className="animate-spin" />;
}
// ─── Empty State ──────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="text-slate-300">{icon}</div>
      <div>
        <p className="font-semibold text-slate-700">{title}</p>
        {description && <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  if (!open) return null;
  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative bg-white rounded-2xl shadow-2xl w-full animate-fade-up", widths[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[--border]">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none">×</button>
        </div>
        <div className="overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────
interface ConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  loading?: boolean;
  variant?: "danger" | "primary";
}

export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmText = "Confirm", loading, variant = "danger" }: ConfirmProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="p-6">
        <p className="text-sm text-slate-600">{description}</p>
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmText}</Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: string[];
}

export function PageHeader({ title, subtitle, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        {breadcrumb && (
          <p className="text-xs text-slate-400 mb-1">{breadcrumb.join(" / ")}</p>
        )}
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────
import { STATUS_CONFIG } from "@/lib/utils";
import type { OrderStatus } from "@/types";
import theme from "@/theme";

export function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium", cfg.bg, cfg.text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────
interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  skeletonRows?: number;
  onRowClick?: (row: T) => void;
  keyExtractor?: (row: T) => string;
  emptyState?: ReactNode;
}

export function Table<T>({ columns, data, loading, skeletonRows = 6, onRowClick, keyExtractor, emptyState }: TableProps<T>) {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {columns.map((c) => (
                <th key={c.key} className={cn("text-left text-xs font-medium text-slate-500 uppercase tracking-wide py-3 px-4", c.headerClassName)}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={i} className="border-b border-[--border]/60">
                {columns.map((c) => (
                  <td key={c.key} className="py-3.5 px-4">
                    <div className="skeleton h-4 w-full max-w-[120px]" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data.length && emptyState) return <>{emptyState}</>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[--border]">
            {columns.map((c) => (
              <th key={c.key} className={cn("text-left text-xs font-medium text-slate-500 uppercase tracking-wide py-3 px-4", c.headerClassName)}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={keyExtractor ? keyExtractor(row) : i}
              onClick={() => onRowClick?.(row)}
              className={cn("border-b border-[--border]/60 transition-colors", onRowClick && "cursor-pointer hover:bg-slate-50/80")}
            >
              {columns.map((c) => (
                <td key={c.key} className={cn("py-3.5 px-4 text-sm text-slate-700", c.className)}>
                  {c.render ? c.render(row) : String((row as any)[c.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────
interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}

export function Pagination({ page, totalPages, total, limit, onPage }: PaginationProps) {
  if (totalPages <= 1) return null;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[--border]">
      <p className="text-sm text-slate-500">{start}–{end} of {total}</p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="xs" disabled={page <= 1} onClick={() => onPage(page - 1)}>← Prev</Button>
        <span className="px-2.5 py-1 text-xs font-medium text-slate-700">{page} / {totalPages}</span>
        <Button variant="outline" size="xs" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Next →</Button>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
}

export function StatCard({ label, value, change, icon, iconBg, iconColor }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p style={{ color: theme.colors.muted }} className="text-sm font-medium">{label}</p>
          <p style={{ color: theme.colors.dark }} className="text-2xl font-semibold mt-1 tracking-tight">{value}</p>
          {change !== undefined && (
            <p className={cn("text-xs mt-1.5 font-medium flex items-center gap-1", change >= 0 ? "text-emerald-600" : "text-red-500")}>
              {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% vs last week
            </p>
          )}
        </div>
        <div
          style={{
            backgroundColor: iconBg || theme.colors.subtitle,
            color: iconColor || theme.colors.primary
          }}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
