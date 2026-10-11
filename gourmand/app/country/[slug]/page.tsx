import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { products } from "@/data/products";

import CountryTabs from "@/components/CountryTabs";
import ProductCard from "@/components/ProductCard";

const countries: Record<string, { name: string; banner: string }> = {
  japan: { name: "일본", banner: "/images/banner-japan.png" },
  taiwan: { name: "대만", banner: "/images/banner-taiwan.png" },
  china: { name: "중국", banner: "/images/banner-china.png" },
  vietnam: { name: "베트남", banner: "/images/banner-vietnam.png" },
  other: { name: "그 외", banner: "/images/banner-global.png" },
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

// 주소를 읽고 나라 배너 + 탭 + 상품 목록을 표시하는 부분
async function CountryContent({ params }: CountryPageProps) {
  const { slug } = await params;

  const country = countries[slug];

  if (!country) {
    notFound();
  }

  const countryProducts = products
    .filter((p) => {
      if (slug === "other") {
        return !["일본", "대만", "중국", "베트남"].includes(p.country);
      }

      return p.country === country.name;
    })
    // 품절 상품은 뒤로
    .sort(
      (a, b) =>
        Number(a.isSoldOut || a.stock === 0) -
        Number(b.isSoldOut || b.stock === 0)
    );

  return (
    <>
      {/* 1. 나라 전용 배너 */}
      {/* 배너 속 '지금 둘러보기'를 누르면 상품 목록으로 이동 */}
      <a
        href="#products"
        className="relative block aspect-[16/9] overflow-hidden rounded-2xl bg-brand-soft md:aspect-[3/1]"
      >
        <Image
          src={country.banner}
          alt={`${country.name} 과자 여행`}
          fill
          priority
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="object-cover object-center"
        />
      </a>

      {/* 2. 나라 전환 탭 */}
      <div className="mt-5">
        <CountryTabs active={slug} />
      </div>

      {/* 3. 상품 목록 */}
      <section id="products" className="mt-8 scroll-mt-24">
        <div className="mb-6 flex items-baseline gap-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {country.name} 간식
          </h1>
          <span className="text-sm text-gray-500">
            {countryProducts.length}개의 상품
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {countryProducts.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}

// 페이지 전체 배치
export default function CountryPage({ params }: CountryPageProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <Suspense
        fallback={
          <p className="text-sm text-gray-500">상품을 불러오는 중이에요…</p>
        }
      >
        <CountryContent params={params} />
      </Suspense>
    </main>
  );
}
