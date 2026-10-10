"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { Product } from "@/types/product";

export default function AddToCartButton({ p }: { p: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const soldOut = p.isSoldOut || p.stock === 0;
  const price =
    p.discountPrice !== undefined && p.discountPrice < p.price
      ? p.discountPrice
      : p.price;

  function handleClick() {
    addItem({
      id: p.id,
      name: p.name,
      imageUrl: p.imageUrl,
      price,
      stock: p.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={soldOut}
      className="mt-3 w-full rounded-lg border border-[#12306b] py-2 text-sm font-semibold text-[#12306b] transition hover:bg-[#12306b] hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
    >
      {soldOut ? "품절" : added ? "담았어요 ✓" : "장바구니 담기"}
    </button>
  );
}