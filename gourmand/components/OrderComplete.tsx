"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLastOrder, type Order } from "@/lib/orderStorage";

export default function OrderComplete() {
    const [order, setOrder] = useState<Order | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setOrder(getLastOrder());
        setLoaded(true);
    }, []);

    if (!loaded) {
        return <p className="py-20 text-center text-gray-500">불러오는 중...</p>;
    }

    if (!order) {
        return (
            <div className="py-20 text-center">
                <p className="text-gray-600">확인할 주문 내역이 없어요.</p>
                <Link
                    href="/"
                    className="mt-4 inline-block rounded-lg bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-dark"
                >
                    홈으로
                </Link>
            </div>
        );
    }

    const { buyer } = order;

    return (
        <div className="mx-auto max-w-2xl">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">주문이 완료되었어요</h1>
                <p className="mt-2 text-sm text-gray-500">
                    주문번호 <span className="font-semibold text-gray-900">{order.orderId}</span>
                    {" · "}
                    {order.status}
                </p>
            </div>

            <section className="mt-8 rounded-xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900">주문 상품</h2>
                <ul className="mt-4 divide-y divide-gray-100">
                    {order.items.map((i) => (
                        <li key={i.id} className="flex items-center gap-4 py-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={i.imageUrl}
                                alt={i.name}
                                className="h-16 w-16 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="line-clamp-1 text-sm font-medium text-gray-900">{i.name}</p>
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
                <div className="mt-2 flex justify-between border-t border-gray-200 pt-4">
                    <span className="font-semibold text-gray-900">총 결제금액</span>
                    <span className="text-xl font-bold text-gray-900">
                        {order.totalPrice.toLocaleString()}원
                    </span>
                </div>
            </section>

            <section className="mt-4 rounded-xl border border-gray-200 p-6 text-sm text-gray-700">
                <h2 className="font-bold text-gray-900">배송 정보</h2>
                <dl className="mt-4 space-y-2">
                    <div className="flex gap-4">
                        <dt className="w-20 text-gray-500">받는 분</dt>
                        <dd>{buyer.buyerName}</dd>
                    </div>
                    <div className="flex gap-4">
                        <dt className="w-20 text-gray-500">연락처</dt>
                        <dd>{buyer.phone}</dd>
                    </div>
                    <div className="flex gap-4">
                        <dt className="w-20 text-gray-500">주소</dt>
                        <dd>
                            ({buyer.zipcode}) {buyer.address1} {buyer.address2}
                        </dd>
                    </div>
                </dl>
            </section>

            <div className="mt-8 flex justify-center gap-3">
                <Link
                    href="/mypage"
                    className="inline-block rounded-lg border border-brand-line px-6 py-3 font-semibold text-brand transition hover:bg-gray-50"
                >
                    주문 내역 보기
                </Link>
                <Link
                    href="/"
                    className="inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
                >
                    쇼핑 계속하기
                </Link>
            </div>
        </div>
    );
}