"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  deliveryFeePaise,
  findVariant,
  freeDeliveryThresholdPaise,
  subscriptionDiscountRate,
} from "@/data/products";

export type CartLine = {
  variantId: string;
  productId: string;
  name: string;
  packLabel: string;
  packCount: number;
  unitPricePaise: number;
  compareAtPaise?: number;
  image: string;
  qty: number;
};

export type Plan = "one-time" | "weekly";

type CartValue = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotalPaise: number;
  deliveryPaise: number;
  discountPaise: number;
  totalPaise: number;
  plan: Plan;
  setPlan: (plan: Plan) => void;
  freeDeliveryGapPaise: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (productId: string, packId: string, qty?: number) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  lastAdded: string | null;
};

const CartContext = createContext<CartValue | null>(null);
const STORAGE_KEY = "egglu.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [plan, setPlan] = useState<Plan>("one-time");
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  // Hydrate from localStorage after mount to keep SSR markup stable.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { lines?: CartLine[]; plan?: Plan };
        if (Array.isArray(parsed.lines)) setLines(parsed.lines.filter((l) => l && l.qty > 0));
        if (parsed.plan === "weekly" || parsed.plan === "one-time") setPlan(parsed.plan);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, plan }));
    } catch {
      /* storage full or blocked */
    }
  }, [lines, plan, ready]);

  useEffect(() => {
    if (!lastAdded) return;
    const t = window.setTimeout(() => setLastAdded(null), 1400);
    return () => window.clearTimeout(t);
  }, [lastAdded]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const add = useCallback((productId: string, packId: string, qty = 1) => {
    const found = findVariant(`${productId}::${packId}`);
    if (!found) return;
    const variantId = `${productId}::${packId}`;
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === variantId);
      if (existing) {
        return prev.map((l) =>
          l.variantId === variantId ? { ...l, qty: Math.min(l.qty + qty, 30) } : l,
        );
      }
      return [
        ...prev,
        {
          variantId,
          productId,
          name: found.product.name,
          packLabel: found.pack.label,
          packCount: found.pack.count,
          unitPricePaise: found.pack.pricePaise,
          compareAtPaise: found.pack.compareAtPaise,
          image: found.product.image,
          qty: Math.min(qty, 30),
        },
      ];
    });
    setLastAdded(variantId);
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.variantId !== variantId)
        : prev.map((l) => (l.variantId === variantId ? { ...l, qty: Math.min(qty, 30) } : l)),
    );
  }, []);

  const remove = useCallback((variantId: string) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const totals = useMemo(() => {
    const subtotalPaise = lines.reduce((sum, l) => sum + l.unitPricePaise * l.qty, 0);
    const isWeekly = plan === "weekly";
    const discountPaise = isWeekly ? Math.round(subtotalPaise * subscriptionDiscountRate) : 0;
    const afterDiscount = subtotalPaise - discountPaise;
    const free = afterDiscount >= freeDeliveryThresholdPaise || afterDiscount === 0;
    const deliveryPaise = free ? 0 : deliveryFeePaise;
    return {
      subtotalPaise,
      discountPaise,
      deliveryPaise,
      totalPaise: afterDiscount + deliveryPaise,
      freeDeliveryGapPaise: Math.max(freeDeliveryThresholdPaise - afterDiscount, 0),
    };
  }, [lines, plan]);

  const value: CartValue = {
    lines,
    ready,
    plan,
    setPlan,
    count: lines.reduce((n, l) => n + l.qty, 0),
    ...totals,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    add,
    setQty,
    remove,
    clear,
    lastAdded,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
