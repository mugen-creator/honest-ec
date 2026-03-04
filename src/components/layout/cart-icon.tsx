"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

export function CartIcon() {
  const { getItemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const prevCount = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? getItemCount() : 0;

  // Animate when count increases
  useEffect(() => {
    if (mounted && count > prevCount.current) {
      setBouncing(true);
      setTimeout(() => setBouncing(false), 400);
    }
    prevCount.current = count;
  }, [count, mounted]);

  return (
    <Link
      href="/cart"
      className="p-2 hover:text-amber-600 transition-colors relative"
      aria-label="カート"
    >
      <ShoppingBag className={cn("w-5 h-5", bouncing && "animate-cart-bounce")} />
      {count > 0 && (
        <span
          className={cn(
            "absolute -top-1 -right-1 w-5 h-5 bg-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center transition-transform",
            bouncing && "scale-110"
          )}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
