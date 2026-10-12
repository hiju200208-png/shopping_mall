"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import CartBadge from "@/components/CartBadge";

const countries = [
  { name: "일본", slug: "japan" },
  { name: "대만", slug: "taiwan" },
  { name: "중국", slug: "china" },
  { name: "베트남", slug: "vietnam" },
  { name: "그 외", slug: "other" },
];

// 돋보기 아이콘
function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      viewBox="0 0 24 24"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

// PC와 모바일에서 사용하는 검색창
function SearchBox({ autoFocus = false }: { autoFocus?: boolean }) {
  return (
    <form
      action="/products"
      role="search"
      className="flex h-11 w-full items-center rounded-full border border-brand-line bg-brand-soft pl-4 pr-1 transition focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-soft"
    >
      <input
        type="search"
        name="q"
        aria-label="간식 검색"
        autoFocus={autoFocus}
        placeholder="어떤 간식을 찾으세요?"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-slate-500"
      />

      <button
        type="submit"
        aria-label="검색"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-sm transition hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <SearchIcon />
      </button>
    </form>
  );
}

// 나라 메뉴 링크 (PC 가로 메뉴 / 모바일 펼침 메뉴 공통)
function CountryLinks({
  current,
  mobile = false,
  onNavigate,
}: {
  current: string | null; // 지금 보고 있는 나라 slug (모르면 null)
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      {countries.map((country) => {
        const active = current === country.slug;
        const style = mobile
          ? `block border-b border-gray-50 px-5 py-3 font-medium ${
              active ? "bg-brand-soft font-bold text-brand" : "text-gray-700"
            }`
          : `border-b-2 py-1 text-[17px] font-semibold transition hover:text-brand ${
              active ? "border-brand text-brand" : "border-transparent text-gray-700"
            }`;
        return (
          <Link
            key={country.slug}
            href={`/country/${country.slug}`}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={style}
          >
            {country.name}
          </Link>
        );
      })}
    </>
  );
}

// 현재 주소를 읽어서 강조 (주소는 접속 시점에만 알 수 있어 Suspense 안에서만 사용)
function ActiveCountryLinks(props: { mobile?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const current = pathname.startsWith("/country/")
    ? pathname.split("/")[2]
    : null;
  return <CountryLinks current={current} {...props} />;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header data-shop-chrome className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      {/* PC 헤더 */}
      <div className="mx-auto hidden h-20 max-w-6xl items-center gap-5 px-4 lg:flex xl:gap-8">
        {/* 로고 */}
        <Link href="/" className="shrink-0">
          <img
            src="/images/common/logo.png"
            alt="구르망 GOURMAND"
            className="h-20 w-auto"
          />
        </Link>

        {/* 국가별 메뉴 */}
        <nav
          aria-label="국가별 상품"
          className="flex shrink-0 items-center gap-4 whitespace-nowrap xl:gap-6"
        >
          {/* 미리 만들어 둔 화면에는 강조 없이, 접속 후 현재 나라를 강조 */}
          <Suspense fallback={<CountryLinks current={null} />}>
            <ActiveCountryLinks />
          </Suspense>
        </nav>

        {/* 검색창 */}
        <div className="ml-auto min-w-0 max-w-64 flex-1">
          <SearchBox />
        </div>

        {/* 장바구니 · 마이페이지 */}
        <div className="flex shrink-0 items-center gap-5 whitespace-nowrap">
          <Link
            href="/cart"
            className="flex flex-col items-center gap-1 text-[13px] font-medium text-gray-700 transition hover:text-brand"
          >
            <span className="relative">
              <img
                src="/images/common/cart_icon.png"
                alt=""
                className="h-7 w-7"
              />
              <CartBadge />
            </span>
            <span>장바구니</span>
          </Link>

          <Link
            href="/mypage"
            className="flex flex-col items-center gap-1 text-[13px] font-medium text-gray-700 transition hover:text-brand"
          >
            <img
              src="/images/common/my_page_icon.png"
              alt=""
              className="h-7 w-7"
            />
            <span>마이페이지</span>
          </Link>
        </div>
      </div>

      {/* 모바일 헤더 */}
      <div className="relative flex h-14 items-center justify-between px-3 lg:hidden">
        {/* 햄버거 메뉴 */}
        <button
          type="button"
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-gray-800"
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* 가운데 로고 */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2"
        >
          <img
            src="/images/common/logo.png"
            alt="구르망 GOURMAND"
            className="h-10 w-auto"
          />
        </Link>

        {/* 검색 버튼 + 장바구니 */}
        <div className="flex items-center">
          <button
            type="button"
            aria-label={searchOpen ? "검색 닫기" : "검색 열기"}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-10 w-10 items-center justify-center text-gray-800"
          >
            <SearchIcon />
          </button>

          <Link
            href="/cart"
            aria-label="장바구니"
            className="p-2"
          >
            <span className="relative block">
              <img
                src="/images/common/cart_icon.png"
                alt=""
                className="h-6 w-6"
              />
              <CartBadge />
            </span>
          </Link>
        </div>
      </div>

      {/* 모바일 검색창 */}
      {searchOpen && (
        <div className="border-t border-gray-100 px-3 py-3 lg:hidden">
          <SearchBox autoFocus />
        </div>
      )}

      {/* 모바일 국가별 메뉴 */}
      {menuOpen && (
        <nav
          aria-label="국가별 상품"
          className="border-t border-gray-100 lg:hidden"
        >
          <Suspense
            fallback={
              <CountryLinks current={null} mobile onNavigate={() => setMenuOpen(false)} />
            }
          >
            <ActiveCountryLinks mobile onNavigate={() => setMenuOpen(false)} />
          </Suspense>
        </nav>
      )}
    </header>
  );
}
