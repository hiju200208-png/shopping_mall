import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "구르망 관리자",
  robots: { index: false, follow: false }, // 검색엔진에 노출하지 않음
};

// 관리자 화면에서는 쇼핑몰 헤더 · 푸터 · 모바일 하단 탭을 숨깁니다.
// (각 요소에 붙은 data-shop-chrome 표시를 기준으로 가림)
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`[data-shop-chrome]{display:none !important}body{padding-bottom:0 !important;background:#FBF8F5}`}</style>
      {children}
    </>
  );
}
