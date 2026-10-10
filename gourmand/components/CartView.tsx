"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartView() {
  const {
    items,
    hydrated,
    totalCount,
    totalPrice,
    setQuantity,
    removeItem,
    clearCart,
  } = useCart();

  // sessionStorage를 읽기 전에는 빈 장바구니로 깜빡이지 않게 대기
  if (!hydrated) {
    return <p className="mt-6 text-sm text-gray-500">장바구니를 불러오는 중이에요…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-gray-200 py-16 text-center">
        <p className="text-gray-600">장바구니가 비어 있어요.</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-[#12306b] px-5 py-2.5 text-sm font-semibold text-white"
        >
          쇼핑 계속하기
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* 담은 상품 목록 */}
      <section>
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 text-sm">
          <span className="text-gray-600">총 {totalCount}개</span>
          <button
            type="button"
            onClick={clearCart}
            className="text-gray-500 hover:text-gray-900"
          >
            전체 비우기
          </button>
        </div>

        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-24 w-24 shrink-0 rounded-lg border border-gray-200 bg-white object-contain p-2"
              />

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <p className="line-clamp-2 text-[15px] font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`${item.name} 삭제`}
                    className="shrink-0 text-sm text-gray-400 hover:text-gray-900"
                  >
                    삭제
                  </button>
                </div>

                <div className="flex items-end justify-between">
                  {/* 수량 조절 */}
                  <div className="flex items-center rounded-lg border border-gray-300 text-sm">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="수량 줄이기"
                      className="px-3 py-1.5 disabled:text-gray-300"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      aria-label="수량 늘리기"
                      className="px-3 py-1.5 disabled:text-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {item.price.toLocaleString()}원
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                </div>

                {item.quantity >= item.stock && (
                  <p className="mt-1 text-xs text-red-500">
                    재고({item.stock}개)까지만 담을 수 있어요
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 결제 금액 */}
      <aside className="h-fit rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-900">결제 예정 금액</h2>
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <span>상품 수량</span>
          <span>{totalCount}개</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-gray-200 pt-4">
          <span className="font-semibold text-gray-900">총 상품금액</span>
          <span className="text-xl font-bold text-gray-900">
            {totalPrice.toLocaleString()}원
          </span>
        </div>
        <button
          type="button"
          disabled
          className="mt-5 w-full rounded-lg bg-gray-300 py-3 font-semibold text-white"
        >
          주문하기 (준비 중)
        </button>
      </aside>
    </div>
  );
}