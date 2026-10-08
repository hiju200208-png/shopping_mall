import Image from "next/image";

import { products } from '@/data/products';
import { Product } from '@/types/product';
import CountryMenu from '@/components/CountryMenu';

// 라벨 + 값 한 줄
function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex gap-2 border-b border-gray-100 py-1.5 last:border-0">
      <dt className="w-24 shrink-0 text-gray-500">{label}</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  );
}

// 상품 1개의 전체 정보 카드
function ProductInfoCard({ p }: { p: Product }) {
  const discountRate =
    p.discountPrice !== undefined ? Math.round((1 - p.discountPrice / p.price) * 100) : 0;
  const hasDiscount = discountRate > 0;

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      {/* 이미지 + 뱃지 */}
      <div className="relative">
        <img src={p.imageUrl} alt={p.name} className="aspect-square w-full object-cover" />
        <div className="absolute left-2 top-2 flex gap-1">
          {p.isNew && (
            <span className="rounded bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">NEW</span>
          )}
          {hasDiscount && (
            <span className="rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              {discountRate}% 할인
            </span>
          )}
        </div>
        {p.isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-2xl font-bold text-white">
            품절
          </div>
        )}
      </div>

      <div className="p-4">
        {/* 기본 정보 */}
        <p className="text-xs text-gray-400">
          #{p.id} · {p.category}
        </p>
        <h2 className="mt-1 text-lg font-bold">{p.name}</h2>
        <p className="mt-1 text-sm text-gray-600">{p.description}</p>

        {/* 가격 */}
        <div className="mt-3 flex items-baseline gap-2">
          {hasDiscount ? (
            <>
              <span className="font-bold text-red-500">{discountRate}%</span>
              <span className="text-xl font-bold">{p.discountPrice?.toLocaleString()}원</span>
              <span className="text-sm text-gray-400 line-through">{p.price.toLocaleString()}원</span>
            </>
          ) : (
            <span className="text-xl font-bold">{p.price.toLocaleString()}원</span>
          )}
        </div>

        {/* 판매 · 배송 · 상세 정보 */}
        <dl className="mt-4 text-sm">
          <InfoRow label="국가" value={p.country} />
          <InfoRow label="평점" value={`★ ${p.rating} (리뷰 ${p.reviewCount.toLocaleString()}개)`} />
          <InfoRow label="재고" value={p.isSoldOut ? '품절' : `${p.stock}개`} />
          <InfoRow label="예상배송" value={`${p.deliveryDays}일 이내`} />
          <InfoRow
            label="내용량"
            value={p.itemCount > 1 ? `${p.volume}${p.unit} × ${p.itemCount}개` : `${p.volume}${p.unit}`}
          />
          <InfoRow label="원산지" value={p.origin} />
          <InfoRow label="식품유형" value={p.foodType} />
          <InfoRow label="제조사" value={p.manufacturer} />
          <InfoRow label="보관방법" value={p.storageMethod} />
        </dl>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      {/* 1. 나라별 바로가기 아이콘 */}
      <CountryMenu />

      {/* 2. 상품 목록 (인기 상품 영역은 담당 팀원 작업 예정) */}
      <h1 className="mb-6 mt-12 text-2xl font-bold">상품 데이터 확인 ({products.length}개)</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductInfoCard key={p.id} p={p} />
        ))}
      </div>
    </main>
  );
}
