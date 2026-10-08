'use client'; // 메뉴 열기/닫기(useState)를 쓰기 때문에 클라이언트 컴포넌트로 선언

import Link from 'next/link';
import { useState } from 'react';

// 헤더 국가 메뉴 목록
const countries = ['일본', '대만', '중국', '베트남', '그 외'];

export default function Header() {
  // 모바일: 햄버거 메뉴 / 검색창이 열려 있는지 기억하는 상태값
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      {/* ================= PC 헤더 (md 이상 화면에서만 보임) ================= */}
      <div className="mx-auto hidden h-20 max-w-6xl items-center gap-8 px-4 lg:flex">
        {/* 1. 로고 (클릭하면 메인으로) */}
        <Link href="/" className="shrink-0">
          <img src="/images/common/logo.png" alt="구르망 GOURMAND" className="h-14 w-auto" />
        </Link>

        {/* 2. 국가 메뉴 */}
        <nav className="flex shrink-0 gap-6 whitespace-nowrap">
          {countries.map((country) => (
            <Link
              key={country}
              href={`/products?country=${encodeURIComponent(country)}`}
              className="font-medium text-gray-700 hover:text-blue-900"
            >
              {country}
            </Link>
          ))}
        </nav>

        {/* 3. 검색창 (지금은 모양만, 검색 기능은 나중에) */}
        <form action="/products" className="ml-auto">
          <input
            type="search"
            name="q"
            placeholder="과자 이름을 검색해 보세요"
            className="w-48 rounded-full xl:w-64 border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none focus:border-blue-900"
          />
        </form>

        {/* 4. 장바구니 · 마이페이지 (아이콘 + 글자) */}
        <div className="flex shrink-0 items-center gap-5 whitespace-nowrap">
          <Link href="/cart" className="flex flex-col items-center text-xs text-gray-700 hover:opacity-70">
            <img src="/images/common/cart_icon.png" alt="" className="h-7 w-7" />
            장바구니
          </Link>
          <Link href="/mypage" className="flex flex-col items-center text-xs text-gray-700 hover:opacity-70">
            <img src="/images/common/my_page_icon.png" alt="" className="h-7 w-7" />
            마이페이지
          </Link>
        </div>
      </div>

      {/* ================= 모바일 헤더 (md 미만 화면에서만 보임) ================= */}
      <div className="relative flex h-14 items-center justify-between px-3 lg:hidden">
        {/* 왼쪽: 햄버거 버튼 (누르면 국가 메뉴 열림/닫힘) */}
        <button
          type="button"
          aria-label="메뉴 열기"
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-gray-800"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* 가운데: 로고 */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <img src="/images/common/logo.png" alt="구르망 GOURMAND" className="h-10 w-auto" />
        </Link>

        {/* 오른쪽: 검색 버튼 + 장바구니 */}
        <div className="flex items-center">
          <button
            type="button"
            aria-label="검색 열기"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-gray-800"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
            </svg>
          </button>
          <Link href="/cart" aria-label="장바구니" className="p-2">
            <img src="/images/common/cart_icon.png" alt="" className="h-6 w-6" />
          </Link>
        </div>
      </div>

      {/* 모바일: 검색창 (검색 버튼을 눌렀을 때만 보임) */}
      {searchOpen && (
        <form action="/products" className="border-t border-gray-100 px-3 py-2 lg:hidden">
          <input
            type="search"
            name="q"
            autoFocus
            placeholder="과자 이름을 검색해 보세요"
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none focus:border-blue-900"
          />
        </form>
      )}

      {/* 모바일: 국가 메뉴 (햄버거 버튼을 눌렀을 때만 보임) */}
      {menuOpen && (
        <nav className="border-t border-gray-100 lg:hidden">
          {countries.map((country) => (
            <Link
              key={country}
              href={`/products?country=${encodeURIComponent(country)}`}
              onClick={() => setMenuOpen(false)} // 메뉴를 고르면 자동으로 닫기
              className="block border-b border-gray-50 px-5 py-3 font-medium text-gray-700"
            >
              {country}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
