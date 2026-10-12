"use client";

import { useSyncExternalStore } from "react";
import { useCart } from "@/components/CartProvider";

// 화면이 브라우저에 붙은 뒤에만 true (서버 HTML과 첫 화면을 똑같이 맞추기 위함)
// 하단 탭바처럼 Suspense 안에서 늦게 붙는 곳에서도 숫자가 어긋나지 않아요
const noop = () => () => {};
function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export default function CartBadge() {
  const { totalCount, hydrated } = useCart();
  const mounted = useMounted();

  if (!mounted || !hydrated || totalCount === 0) return null;

  return (
    <span className="absolute -right-2 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
      {totalCount > 99 ? "99+" : totalCount}
    </span>
  );
}