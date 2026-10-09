import { products } from "@/data/products";

import CountryMenu from "@/components/CountryMenu";
import ProductCard from "@/components/ProductCard";
import MainBanner from "@/components/MainBanner";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      {/* 1. 자동 슬라이드 메인 배너 */}
      <MainBanner />

      {/* 2. 나라별 바로가기 아이콘 */}
      <section className="mt-6">
        <CountryMenu />
      </section>

      {/* 3. 상품 목록 */}
      <section className="mt-10">
        <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-2xl font-bold">
            세계의 간식을 만나보세요
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {products.length}개의 상품
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </main>
  );
}