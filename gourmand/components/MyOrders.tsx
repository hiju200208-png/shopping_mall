"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders, getSavedShipping, type Order, type OrderInput } from "@/lib/orderStorage";

function formatDate(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [shipping, setShipping] = useState<OrderInput | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOrders(getOrders());
    setShipping(getSavedShipping());
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p className="py-20 text-center text-gray-500">불러오는 중...</p>;
  }

  return (
    <div className="space-y-8">
      {/* 저장된 배송 정보 */}
      <section className="rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900">저장된 배송 정보</h2>
        {shipping ? (
          <dl className="mt-4 space-y-2 text-sm text-gray-700">
            <div className="flex gap-4">
              <dt className="w-20 text-gray-500">받는 분</dt>
              <dd>{shipping.buyerName}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-20 text-gray-500">연락처</dt>
              <dd>{shipping.phone}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-20 text-gray-500">주소</dt>
              <dd>
                ({shipping.zipcode}) {shipping.address1} {shipping.address2}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-3 text-sm text-gray-500">
            아직 저장된 배송 정보가 없어요. 주문할 때 입력하면 여기에 저장돼요.
          </p>
        )}
      </section>

      {/* 주문 내역 */}
      <section>
        <h2 className="mb-3 font-bold text-gray-900">
          주문 내역 <span className="text-gray-400">({orders.length})</span>
        </h2>

        {orders.length === 0 ? (
          <div className="rounded-xl border border-gray-200 py-16 text-center">
            <p className="text-gray-600">아직 주문 내역이 없어요.</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-dark"
            >
              쇼핑하러 가기
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.orderId} className="rounded-xl border border-gray-200 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{order.orderId}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.orderedAt)}</p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {order.status}
                  </span>
                </div>

                <ul className="mt-4 divide-y divide-gray-100">
                  {order.items.map((i) => (
                    <li key={i.id} className="flex items-center gap-3 py-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={i.imageUrl}
                        alt={i.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${i.id}`}
                          className="line-clamp-1 text-sm font-medium text-gray-900 hover:underline"
                        >
                          {i.name}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {i.price.toLocaleString()}원 × {i.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {(i.price * i.quantity).toLocaleString()}원
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-2 flex justify-between border-t border-gray-200 pt-3 text-sm">
                  <span className="text-gray-600">총 결제금액</span>
                  <span className="font-bold text-gray-900">
                    {order.totalPrice.toLocaleString()}원
                  </span>
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  배송지: {order.buyer.buyerName} · {order.buyer.phone} · ({order.buyer.zipcode}){" "}
                  {order.buyer.address1} {order.buyer.address2}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}