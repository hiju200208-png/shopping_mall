
import { notFound } from "next/navigation";

import { products } from "@/data/products";

import MainBanner from "@/components/MainBanner";
import CountryMenu from "@/components/CountryMenu";
import ProductCard from "@/components/ProductCard";

// 국가별 URL 설정
const countries: Record<string, string> = {
  japan: "일본",
  taiwan: "대만",
  china: "중국",
  vietnam: "베트남",
  other: "그 외",
};

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 선택한 국가 확인
  const countryName = countries[slug];

  // 존재하지 않는 국가라면 404
  if (!countryName) {
    notFound();
  }

  // 국가별 상품 필터링
  const countryProducts = products.filter((p) => {
    if (slug === "other") {
      return !["일본", "대만", "중국", "베트남"].includes(
        p.country
      );
    }

    return p.country === countryName;
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">

      {/* 1. 기존 메인 자동 슬라이드 배너 */}
      <MainBanner />

      {/* 2. 나라별 바로가기 아이콘 */}
      <section className="mt-6">
        <CountryMenu />
      </section>

      {/* 3. 선택한 국가의 상품 목록 */}
      <section className="mt-10">

        <h1 className="mb-6 text-2xl font-bold">
          {countryName} 상품 ({countryProducts.length}개)
        </h1>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {countryProducts.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>

      </section>

    </main>
  );
}
