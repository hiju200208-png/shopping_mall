import { products } from "@/data/products";
import { Product } from "@/types/product";

import CountryMenu from "@/components/CountryMenu";
import ProductCard from "@/components/ProductCard";
import MainBanner from "@/components/MainBanner";
import HomeSection from "@/components/HomeSection";
import ProductRow from "@/components/ProductRow";

const isSoldOut = (p: Product) => p.isSoldOut || p.stock === 0;
const hasDiscount = (p: Product) =>
  p.discountPrice !== undefined && p.discountPrice < p.price;

// 품절 상품은 항상 뒤로
const soldOutLast = (a: Product, b: Product) =>
  Number(isSoldOut(a)) - Number(isSoldOut(b));

// 나라별 섹션 (홈에서는 나라마다 대표 상품 4개만 보여주고, 나머지는 전체보기로)
const countrySections = [
  { slug: "japan", title: "일본 간식", subtitle: "편의점부터 공항 기념품까지", match: ["일본"] },
  { slug: "taiwan", title: "대만 간식", subtitle: "펑리수부터 누가까지", match: ["대만"] },
  { slug: "china", title: "중국 간식", subtitle: "해바라기씨부터 대백토 캐러멜까지", match: ["중국"] },
  { slug: "vietnam", title: "베트남 간식", subtitle: "코코넛과 열대 과일의 맛", match: ["베트남"] },
  { slug: "other", title: "그 외 나라 간식", subtitle: "미국·프랑스의 스테디셀러", match: null },
];
const mainCountries = ["일본", "대만", "중국", "베트남"];
const HOME_COUNT = 4;

export default function Home() {
  const newProducts = products.filter((p) => p.isNew).sort(soldOutLast);
  // 신상품 줄에 이미 나온 상품은 할인 줄에서 빼기 (같은 상품이 반복되지 않게)
  const saleProducts = products
    .filter((p) => hasDiscount(p) && !p.isNew)
    .sort(soldOutLast);

  // 위 두 줄에 나온 상품은 나라별 대표 상품에서 뒤로 미루기
  const shownAbove = new Set([...newProducts, ...saleProducts].map((p) => p.id));
  const notShownFirst = (a: Product, b: Product) =>
    Number(shownAbove.has(a.id)) - Number(shownAbove.has(b.id));

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      {/* 1. 자동 슬라이드 메인 배너 */}
      <MainBanner />

      {/* 2. 나라별 바로가기 아이콘 */}
      <section className="mt-6">
        <CountryMenu />
      </section>

      {/* 3. 신상품 */}
      {newProducts.length > 0 && (
        <HomeSection title="새로 들어왔어요" subtitle="구르망에 막 도착한 신상 간식">
          <ProductRow>
            {newProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </ProductRow>
        </HomeSection>
      )}

      {/* 4. 할인 상품 */}
      {saleProducts.length > 0 && (
        <HomeSection title="지금 할인 중" subtitle="놓치기 아까운 특가 간식">
          <ProductRow>
            {saleProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </ProductRow>
        </HomeSection>
      )}

      {/* 5. 나라별 대표 상품 */}
      {countrySections.map((section) => {
        const items = products
          .filter((p) =>
            section.match
              ? section.match.includes(p.country)
              : !mainCountries.includes(p.country)
          )
          .sort((a, b) => soldOutLast(a, b) || notShownFirst(a, b) || b.rating - a.rating);

        if (items.length === 0) return null;

        return (
          <HomeSection
            key={section.slug}
            title={section.title}
            subtitle={`${section.subtitle} · ${items.length}개`}
            href={`/country/${section.slug}`}
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
              {items.slice(0, HOME_COUNT).map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </HomeSection>
        );
      })}
    </main>
  );
}
