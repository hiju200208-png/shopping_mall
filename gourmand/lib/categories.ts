import { products } from "@/data/products";
import type { Product } from "@/types/product";

// 과자 종류별 카테고리
// data/products.ts(DB에서 생성)의 category 값은 그대로 두고,
// 여기서 "상품 번호 → 카테고리"를 따로 정해요. 새 상품이 생기면 productIds에 번호를 추가하세요.
export interface Category {
  slug: string; // 주소: /category/snack
  name: string;
  desc: string; // 한 줄 소개
  imageId: number; // 대표 사진으로 쓸 상품 번호
  productIds: number[];
}

export const CATEGORIES: Category[] = [
  {
    slug: "snack",
    name: "스낵·칩",
    desc: "감자·옥수수·쌀로 만든 바삭한 스낵",
    imageId: 1,
    productIds: [1, 2, 9, 12, 13, 16, 27, 28, 33, 34, 36, 39, 43, 44, 46, 48],
  },
  {
    slug: "cookie",
    name: "쿠키·비스킷",
    desc: "오레오부터 버터 비스킷까지",
    imageId: 41,
    productIds: [6, 23, 41, 49, 51, 52, 56, 60],
  },
  {
    slug: "bakery",
    name: "케이크·베이커리",
    desc: "도쿄바나나·펑리수·마들렌",
    imageId: 4,
    productIds: [4, 11, 14, 18, 20, 29, 40, 47, 50, 53, 54],
  },
  {
    slug: "chocolate",
    name: "초콜릿",
    desc: "생초콜릿부터 초코 과자까지",
    imageId: 7,
    productIds: [5, 7, 10, 32, 42, 45, 55],
  },
  {
    slug: "candy",
    name: "젤리·캔디",
    desc: "하리보·곤약젤리·밀크 캔디",
    imageId: 58,
    productIds: [3, 8, 15, 25, 26, 30, 31, 35, 37, 57, 58, 59],
  },
  {
    slug: "savory",
    name: "육포·견과·별미",
    desc: "육포, 해바라기씨, 말린 과일",
    imageId: 22,
    productIds: [17, 19, 21, 22, 24, 38],
  },
];

export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

// 상품이 속한 카테고리 (표에 없는 새 상품은 undefined)
export const categoryOf = (productId: number) =>
  CATEGORIES.find((c) => c.productIds.includes(productId));

export const productsIn = (category: Category): Product[] =>
  products.filter((p) => category.productIds.includes(p.id));

export const categoryImage = (category: Category) =>
  products.find((p) => p.id === category.imageId)?.imageUrl ?? "";
