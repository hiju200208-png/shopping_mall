"use client";

import { useCart } from "@/components/CartProvider";

export default function CartBadge() {
  const { totalCount, hydrated } = useCart();

  if (!hydrated || totalCount === 0) return null;

  return (
    <span className="absolute -right-2 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
      {totalCount > 99 ? "99+" : totalCount}
    </span>
  );
}