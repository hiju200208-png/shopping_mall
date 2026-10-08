import Link from "next/link";
import { Product } from "@/types/product";

export default function ProductCard({ p }: { p: Product }) {
  const salePrice = p.discountPrice;
  const discountRate =
    salePrice !== undefined && salePrice < p.price
      ? Math.round((1 - salePrice / p.price) * 100)
      : 0;
  const hasDiscount = discountRate > 0;
  const soldOut = p.isSoldOut || p.stock === 0;

  // 별점 채움 비율 (0 ~ 100%)
  const ratingPercent = Math.max(0, Math.min(100, (p.rating / 5) * 100));

  return (
    // 상세 페이지 경로는 팀에서 정한 라우트에 맞게 href만 바꾸세요
    <Link href={`/products/${p.id}`} className="group block">
      {/* 이미지 */}
      <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-white">
        <img
          src={p.imageUrl}
          alt={p.name}
          className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
        />

        {p.isNew && (
          <span className="absolute left-2 top-2 rounded bg-[#12306b] px-2 py-0.5 text-[11px] font-bold text-white">
            NEW
          </span>
        )}

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="rounded-full bg-gray-800 px-4 py-1.5 text-sm font-bold text-white">
              품절
            </span>
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="mt-3 px-1">
        {/* 이름: 한 줄까지, 넘치면 ... */}
        <h3
          className={`line-clamp-1 text-[15px] font-semibold leading-[22px] ${
            soldOut ? "text-gray-400" : "text-gray-900"
          }`}
        >
          {p.name}
        </h3>

        {/* 가격 */}
        <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
          {hasDiscount ? (
            <>
              <span className="text-[15px] font-bold text-red-500">{discountRate}%</span>
              <span className="text-lg font-bold text-gray-900">
                {salePrice?.toLocaleString()}원
              </span>
              <span className="text-xs text-gray-400 line-through">
                {p.price.toLocaleString()}원
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {p.price.toLocaleString()}원
            </span>
          )}
        </div>

        {/* 배송 예상 */}
        <p className="mt-1 text-[13px] font-semibold text-[#2f7d5b]">
          {p.deliveryDays}일 이내 도착
        </p>

        {/* 별점 + 리뷰 수 */}
        <div className="mt-1 flex items-center gap-1">
          <span className="relative inline-block text-sm leading-none text-gray-300">
            ★★★★★
            <span
              className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-[#f5a623]"
              style={{ width: `${ratingPercent}%` }}
            >
              ★★★★★
            </span>
          </span>
          <span className="text-xs text-gray-500">({p.reviewCount.toLocaleString()})</span>
        </div>
      </div>
    </Link>
  );
}