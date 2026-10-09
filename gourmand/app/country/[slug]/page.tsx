import { Suspense } from "react";
import { notFound } from "next/navigation";

import { products } from "@/data/products";

import MainBanner from "@/components/MainBanner";
import CountryMenu from "@/components/CountryMenu";
import ProductCard from "@/components/ProductCard";

const countries: Record<string, string> = {
  japan: "일본",
  taiwan: "대만",
  china: "중국",
  vietnam: "베트남",
  other: "그 외",
};

type CountryPageProps = {
  params: Promise<{ slug: string }>;
};

// 국가 주소를 미리 지정
export function generateStaticParams() {
  return Object.keys(countries).map((slug) => ({
    slug,
  }));
}

// 주소를 읽고 국가별 상품을 표시하는 부분
async function CountryProducts({ params }: CountryPageProps) {
  const { slug } = await params;

  const countryName = countries[slug];

  if (!countryName) {
    notFound();
  }

  const countryProducts = products.filter((p) => {
    if (slug === "other") {
      return !["일본", "대만", "중국", "베트남"].includes(
        p.country
      );
    }

    return p.country === countryName;
  });

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">
        {countryName} 상품 ({countryProducts.length}개)
      </h1>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {countryProducts.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </>
  );
}

// 페이지 전체 배치
export default function CountryPage({ params }: CountryPageProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      {/* 1. 메인 자동 슬라이드 배너 */}
      <MainBanner />

      {/* 2. 나라별 바로가기 아이콘 */}
      <section className="mt-6">
        <CountryMenu />
      </section>

      {/* 3. 선택한 국가의 상품 목록 */}
      <section className="mt-10">
        <Suspense
          fallback={
            <p className="text-sm text-gray-500 dark:text-gray-400">
              상품을 불러오는 중이에요…
            </p>
          }
        >
          <CountryProducts params={params} />
        </Suspense>
      </section>
    </main>
  );
}