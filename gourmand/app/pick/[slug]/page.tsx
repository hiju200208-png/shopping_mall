import { Suspense } from "react";
import { notFound } from "next/navigation";

import { products } from "@/data/products";
import { picks } from "@/data/picks";

import CountryMenu from "@/components/CountryMenu";
import ProductCard from "@/components/ProductCard";

// params를 읽는 부분만 따로 분리 (Suspense 안에서 실행됨)
async function PickProducts({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pick = picks[slug];

  // 없는 주소(/pick/abc)는 404
  if (!pick) notFound();

  const pickProducts = pick.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p !== undefined);

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">{pick.title}</h1>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {pickProducts.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </>
  );
}

export default function PickPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      {/* 나라별 바로가기 */}
      <section className="mt-6">
        <CountryMenu />
      </section>

      {/* pick 상품 (params를 읽는 부분만 Suspense) */}
      <section className="mt-10">
        <Suspense fallback={<p className="text-gray-500">불러오는 중...</p>}>
          <PickProducts params={params} />
        </Suspense>
      </section>
    </main>
  );
}