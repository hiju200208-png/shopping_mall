import { products } from "@/data/products";
import { Product } from "@/types/product";

// ── 상품 상태 ──
export const isSoldOut = (p: Product) => p.isSoldOut || p.stock === 0;

export const hasDiscount = (p: Product) =>
  p.discountPrice !== undefined && p.discountPrice < p.price;

// 실제로 결제하는 가격 (할인가가 있으면 할인가)
export const salePrice = (p: Product) =>
  hasDiscount(p) ? (p.discountPrice as number) : p.price;

export const discountRate = (p: Product) =>
  hasDiscount(p) ? Math.round((1 - salePrice(p) / p.price) * 100) : 0;

export const getProduct = (id: number) => products.find((p) => p.id === id);

// ── 나라 ──
export const MAIN_COUNTRIES = ["일본", "대만", "중국", "베트남"];

export const COUNTRY_FILTERS = [
  { slug: "japan", name: "일본" },
  { slug: "taiwan", name: "대만" },
  { slug: "china", name: "중국" },
  { slug: "vietnam", name: "베트남" },
  { slug: "other", name: "그 외" },
];

export const countrySlugOf = (p: Product) =>
  COUNTRY_FILTERS.find((c) => c.name === p.country)?.slug ?? "other";

// ── 카테고리 (작은 분류는 묶어서 보여줌) ──
export const CATEGORY_FILTERS = [
  { slug: "snack", name: "과자", match: ["과자"] },
  { slug: "candy", name: "젤리·캔디", match: ["젤리·캔디", "캔디"] },
  { slug: "chocolate", name: "초콜릿", match: ["초콜릿"] },
  { slug: "bakery", name: "베이커리", match: ["베이커리", "빵·케이크"] },
  { slug: "etc", name: "그 외 간식", match: null }, // 위에 없는 나머지 전부
];

const knownCategories = CATEGORY_FILTERS.flatMap((c) => c.match ?? []);

// ── 정렬 ──
export const SORT_OPTIONS = [
  { slug: "recommend", name: "추천순" },
  { slug: "review", name: "리뷰 많은순" },
  { slug: "low", name: "낮은 가격순" },
  { slug: "high", name: "높은 가격순" },
  { slug: "new", name: "신상품순" },
];

// 검색어 비교용: 소문자 + 띄어쓰기 제거 ("도쿄 바나나" = "도쿄바나나")
const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, "");

export interface ProductQuery {
  q?: string;
  country?: string;
  category?: string;
  sort?: string;
}

// 검색 · 필터 · 정렬을 한 번에
export function findProducts({ q, country, category, sort }: ProductQuery) {
  const keyword = q ? normalize(q) : "";

  let list = products.filter((p) => {
    if (country) {
      if (country === "other") {
        if (MAIN_COUNTRIES.includes(p.country)) return false;
      } else if (countrySlugOf(p) !== country) {
        return false;
      }
    }

    if (category) {
      const group = CATEGORY_FILTERS.find((c) => c.slug === category);
      if (group?.match) {
        if (!group.match.includes(p.category)) return false;
      } else if (group && knownCategories.includes(p.category)) {
        return false;
      }
    }

    if (keyword) {
      const haystack = normalize(
        [p.name, p.country, p.category, p.manufacturer, p.foodType, p.description].join(" ")
      );
      if (!haystack.includes(keyword)) return false;
    }

    return true;
  });

  // 검색어가 상품명에 있으면 더 위로
  const nameScore = (p: Product) =>
    keyword && normalize(p.name).includes(keyword) ? 0 : 1;

  const sorters: Record<string, (a: Product, b: Product) => number> = {
    recommend: (a, b) => nameScore(a) - nameScore(b) || b.rating - a.rating,
    review: (a, b) => b.reviewCount - a.reviewCount,
    low: (a, b) => salePrice(a) - salePrice(b),
    high: (a, b) => salePrice(b) - salePrice(a),
    new: (a, b) => Number(!!b.isNew) - Number(!!a.isNew) || b.id - a.id,
  };
  const sorter = sorters[sort ?? "recommend"] ?? sorters.recommend;

  // 품절 상품은 어떤 정렬이든 맨 뒤로
  list = [...list].sort(
    (a, b) => Number(isSoldOut(a)) - Number(isSoldOut(b)) || sorter(a, b)
  );

  return list;
}

// 검색 화면의 추천 검색어
export const POPULAR_KEYWORDS = [
  "도쿄 바나나",
  "펑리수",
  "곤약젤리",
  "초콜릿",
  "코코넛",
  "하리보",
  "마들렌",
  "쌀과자",
];
