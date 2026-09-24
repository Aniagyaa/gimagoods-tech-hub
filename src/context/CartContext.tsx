import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { products } from "@/data/catalog";
import type { CartItem } from "@/types/commerce";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "gimatech-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    hydrated,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return sum + (product?.price ?? 0) * item.quantity;
    }, 0),
    addItem: (productId, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((item) => item.productId === productId);
        if (existing) return current.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item);
        return [...current, { productId, quantity }];
      });
      toast.success("Added to cart", { description: "Your cart has been updated." });
    },
    updateQuantity: (productId, quantity) => setItems((current) => quantity < 1 ? current.filter((item) => item.productId !== productId) : current.map((item) => item.productId === productId ? { ...item, quantity } : item)),
    removeItem: (productId) => {
      setItems((current) => current.filter((item) => item.productId !== productId));
      toast.success("Removed from cart");
    },
    clearCart: () => setItems([]),
  }), [hydrated, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}