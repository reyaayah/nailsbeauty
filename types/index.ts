// ─── Product (matches existing store) ────────────────────────────────
export interface VideoReview {
  id: string;
  user: string;
  videoUrl: string;
  poster: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  hoverImage?: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  discount?: string;
  reviews?: number;
  rating?: number;
  category: string;
  description?: string;
  features?: string[];
  sizes?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  onSale?: boolean;
  shape?: string;
  length?: string;
  style?: string;
  collection?: string;
  isKit?: boolean;
  kitOptions?: string[];
  isSimple?: boolean;
  stock?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;

  videoReviews?: VideoReview[];
}

// ─── Order (matches existing orderService) ───────────────────────────
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  shape: string;
}

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  notes?: string;
  trackingNumber?: string;
  createdAt: string | { seconds: number; nanoseconds: number };
  updatedAt: string | { seconds: number; nanoseconds: number };
}

// ─── Customer (matches existing UserProfile) ─────────────────────────
export interface Customer {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  createdAt: string;
  updatedAt: string;
  provider: "email" | "google";
  wishlist?: number[];
  addresses?: Address[];
  orderHistory?: string[];
  orderCount?: number;
  totalSpent?: number;
  isBlocked?: boolean;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// ─── Collection ───────────────────────────────────────────────────────
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Blog ─────────────────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  readTime?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Analytics ────────────────────────────────────────────────────────
export interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  revenueByDay: DailyRevenue[];
  ordersByStatus: { status: OrderStatus; count: number }[];
  topProducts: { name: string; sold: number; revenue: number }[];
  recentOrders: Order[];
}

// ─── Admin ────────────────────────────────────────────────────────────
export interface AdminProfile {
  uid: string;
  email: string;
  name: string;
  role: "super_admin" | "admin";
  createdAt: string;
}
