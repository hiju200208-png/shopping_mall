"use client"; // 오류 화면은 반드시 클라이언트 컴포넌트여야 해요

import { useEffect } from "react";
import Link from "next/link";

import { BrokenCookie } from "@/components/CookieIllust";

// 페이지를 그리다가 예상하지 못한 오류가 났을 때 보여주는 화면
// (헤더·푸터는 그대로 두고 가운데 내용만 바뀌어요)
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // 개발할 때 원인을 볼 수 있게 콘솔에 남겨요
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-6xl items-center px-4 py-10 md:py-16">
      <section className="flex w-full flex-col items-center px-2 py-6 text-center md:rounded-3xl md:border-[1.5px] md:border-dashed md:border-brand-line md:px-6 md:py-12">
        <BrokenCookie className="h-[88px] w-[112px] md:h-[104px] md:w-[132px]" />

        <h1 className="mt-5 text-[23px] font-extrabold text-gray-900 md:mt-6 md:text-[30px]">
          잠시 문제가 생겼어요
        </h1>
        <p className="mt-2.5 break-keep text-[15px] leading-relaxed text-[#6E5B50] md:mt-3 md:text-base">
          일시적인 오류로 페이지를 불러오지 못했어요.
          <br /> 잠시 후 다시 시도해 주세요. 장바구니에 담은 상품은 그대로 있어요.
        </p>

        <div className="mt-6 flex w-full flex-col gap-2 md:mt-7 md:w-auto md:flex-row md:gap-2.5">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-brand px-[26px] text-base font-bold text-white transition hover:bg-brand-dark"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M20 12a8 8 0 1 1-2.4-5.7" />
              <path d="M20 4v5h-5" />
            </svg>
            다시 시도
          </button>
          <Link
            href="/"
            className="inline-flex h-[50px] items-center justify-center rounded-full border-[1.5px] border-brand-line px-[26px] text-base font-bold text-brand transition hover:border-brand md:border-brand"
          >
            홈으로 가기
          </Link>
        </div>

        <p className="mt-5 hidden text-[13px] text-[#6E5B50] md:block">
          계속 같은 화면이 나오면 새로고침하거나 잠시 후 다시 들어와 주세요.
        </p>
      </section>
    </main>
  );
}
