"use client";

import { Children, useRef } from "react";

// 가로로 넘겨보는 상품 줄 (모바일: 손가락으로 밀기, 데스크톱: 좌우 화살표)
export default function ProductRow({ children }: { children: React.ReactNode }) {
  const listRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    list.scrollBy({ left: direction * list.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="group/row relative">
      <div
        ref={listRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <div className="w-[44%] shrink-0 snap-start md:w-[31%] lg:w-[calc(25%-12px)]">
            {child}
          </div>
        ))}
      </div>

      {/* 데스크톱 전용 좌우 버튼 */}
      <button
        type="button"
        aria-label="이전 상품 보기"
        onClick={() => scroll(-1)}
        className="absolute -left-5 top-[30%] hidden h-10 w-10 items-center justify-center rounded-full border border-brand-line bg-white text-xl text-brand shadow-md transition hover:bg-brand-soft lg:flex"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="다음 상품 보기"
        onClick={() => scroll(1)}
        className="absolute -right-5 top-[30%] hidden h-10 w-10 items-center justify-center rounded-full border border-brand-line bg-white text-xl text-brand shadow-md transition hover:bg-brand-soft lg:flex"
      >
        ›
      </button>
    </div>
  );
}
