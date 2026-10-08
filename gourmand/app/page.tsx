
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
        <h1 className="mb-6 text-2xl font-bold">
          상품 데이터 확인 ({products.length}개)
        </h1>

        {/* 팀원이 만든 상품 카드 유지 */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

    </main>
  );
}
