export type ProductStatus = "in-stock" | "low-stock" | "demo";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  previousPrice?: number;
  rating: number;
  reviewCount: number;
  status: ProductStatus;
  image: string;
  imageAlt: string;
  featured?: boolean;
  trending?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  icon: string;
}

export interface User { id: string; fullName: string; email: string; phone?: string }
export interface CartItem { productId: string; quantity: number }
export interface Address { region: string; city: string; digitalAddress: string; street: string }
export interface Review { id: string; productId: string; rating: number; comment: string }
export interface OrderItem { productId: string; quantity: number; unitPrice: number }
export interface Order { id: string; items: OrderItem[]; status: string; total: number }
export interface Payment { method: "mobile-money" | "card" | "bank"; status: "pending" | "paid" | "failed" }
