
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// 국가별 배너 이미지
const banners = [
  {
    id: 1,
    country: "일본",
    image: "/images/common/banner-japan.png",
  },
  {
    id: 2,
    country: "대만",
    image: "/images/common/banner-taiwan.png",
  },
  {
    id: 3,
    country: "중국",
    image: "/images/common/banner-china.png",
  },
  {
    id: 4,
    country: "베트남",
    image: "/images/common/banner-vietnam.png",
  },
  {
    id: 5,
    country: "세계과자",
    image: "/images/common/banner-global.png",
  },
];

export default function MainBanner() {
  // 현재 표시 중인 배너
  const [currentIndex, setCurrentIndex] = useState(0);

  // 마우스를 올리면 자동 전환 중지
  const [isPaused, setIsPaused] = useState(false);

  // 5초마다 자동 전환
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, currentIndex]);

  // 다음 배너
  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  // 이전 배너
  const prevBanner = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + banners.length) % banners.length
    );
  };

  return (
    <section
      aria-label="구르망 국가별 간식 배너"
      className="w-full py-6"
    >
      <div
        className="group relative h-[180px] overflow-hidden rounded-2xl bg-rose-50 shadow-md sm:h-[240px] lg:h-[300px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >

        {/* 배너 이미지 */}
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            aria-hidden={index !== currentIndex}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex
                ? "z-10 opacity-100"
                : "pointer-events-none z-0 opacity-0"
            }`}
          >
            <Image
              src={banner.image}
              alt={`${banner.country} 과자 여행 배너`}
              fill
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover object-center"
              priority={index === 0}
            />
          </div>
        ))}

        {/* 이전 버튼 */}
        <button
          type="button"
          onClick={prevBanner}
          aria-label="이전 배너"
          className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-2xl text-gray-800 shadow transition hover:bg-white sm:h-11 sm:w-11"
        >
          ‹
        </button>

        {/* 다음 버튼 */}
        <button
          type="button"
          onClick={nextBanner}
          aria-label="다음 배너"
          className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-2xl text-gray-800 shadow transition hover:bg-white sm:h-11 sm:w-11"
        >
          ›
        </button>

        {/* 하단 페이지 표시 */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/25 px-3 py-2">

          {banners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`${banner.country} 배너 보기`}
              aria-current={
                currentIndex === index ? "true" : undefined
              }
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "w-6 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white"
              }`}
            />
          ))}

        </div>
      </div>
    </section>
  );
}
