import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateInput: string | { seconds: number; nanoseconds: number } | undefined): string {
  if (!dateInput) return "—";
  let date: Date;
  if (typeof dateInput === "object" && "seconds" in dateInput) {
    date = new Date(dateInput.seconds * 1000);
  } else {
    date = new Date(dateInput as string);
  }
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(dateInput: string | { seconds: number; nanoseconds: number } | undefined): string {
  if (!dateInput) return "—";
  let date: Date;
  if (typeof dateInput === "object" && "seconds" in dateInput) {
    date = new Date(dateInput.seconds * 1000);
  } else {
    date = new Date(dateInput as string);
  }
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function toISOString(dateInput: string | { seconds: number; nanoseconds: number } | undefined): string {
  if (!dateInput) return new Date().toISOString();
  if (typeof dateInput === "object" && "seconds" in dateInput) {
    return new Date(dateInput.seconds * 1000).toISOString();
  }
  return dateInput as string;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const STATUS_CONFIG = {
  pending: { label: "Pending", bg: "bg-amber-100", text: "text-amber-800", dot: "bg-amber-500" },
  confirmed: { label: "Confirmed", bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
  shipped: { label: "Shipped", bg: "bg-violet-100", text: "text-violet-800", dot: "bg-violet-500" },
  delivered: { label: "Delivered", bg: "bg-emerald-100", text: "text-emerald-800", dot: "bg-emerald-500" },
  cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
} as const;
