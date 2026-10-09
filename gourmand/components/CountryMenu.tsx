
import Link from 'next/link';

// 나라별 바로가기 목록
const countryMenus = [
  { name: '일본', slug: 'japan', icon: '⛩️', bg: 'bg-red-50' },
  { name: '대만', slug: 'taiwan', icon: '🧋', bg: 'bg-sky-50' },
  { name: '중국', slug: 'china', icon: '🏮', bg: 'bg-orange-50' },
  { name: '베트남', slug: 'vietnam', icon: '🍜', bg: 'bg-amber-50' },
  { name: '그 외', slug: 'other', icon: '🌏', bg: 'bg-blue-50' },
];

// 메인 상단 나라별 바로가기 아이콘
export default function CountryMenu() {
  return (
    // 모바일에서도 5개 아이콘이 한 줄에 표시
    <section className="mx-auto mt-2 grid max-w-3xl grid-cols-5 gap-2 md:mt-4 md:gap-8">
      {countryMenus.map((c) => (
        <Link
          key={c.slug}
          href={`/country/${c.slug}`}
          className="flex flex-col items-center gap-2 hover:opacity-80"
        >
          {/* 기존 동그라미 아이콘 디자인 유지 */}
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl md:h-24 md:w-24 md:text-5xl ${c.bg}`}
          >
            {c.icon}
          </span>

          {/* 국가 이름 */}
          <span className="text-xs font-medium text-gray-700 md:text-sm">
            {c.name}
          </span>
        </Link>
      ))}
    </section>
  );
}
