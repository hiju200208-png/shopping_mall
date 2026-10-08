'use client'; // 현재 주소(usePathname)를 읽어야 해서 클라이언트 컴포넌트로 선언

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 모바일 하단 탭 메뉴 (md 미만 화면에서만 보임)
export default function MobileTabBar() {
  const pathname = usePathname(); // 지금 보고 있는 페이지 주소 (예: '/', '/cart')

  // 탭 목록: 이름, 이동할 주소, 아이콘
  const tabs = [
    {
      label: '홈',
      href: '/',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinejoin="round" d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z" />
        </svg>
      ),
    },
    {
      label: '카테고리',
      href: '/products',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
        </svg>
      ),
    },
    {
      label: '검색',
      href: '/search',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
        </svg>
      ),
    },
    {
      label: '장바구니',
      href: '/cart',
      icon: <img src="/images/common/cart_icon.png" alt="" className="h-6 w-6" />,
    },
    {
      label: '마이페이지',
      href: '/mypage',
      icon: <img src="/images/common/my_page_icon.png" alt="" className="h-6 w-6" />,
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 border-t border-gray-200 bg-white lg:hidden">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href; // 지금 페이지와 같은 탭이면 강조
        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 text-[11px] ${
              isActive ? 'font-bold text-blue-900' : 'text-gray-500'
            }`}
          >
            {tab.icon}
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
