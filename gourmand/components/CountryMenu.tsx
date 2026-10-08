import Link from 'next/link';

// 나라별 바로가기 목록 (아이콘 이미지가 생기면 icon을 이미지 경로로 바꾸면 됨)
const countryMenus = [
  { name: '일본', icon: '⛩️', bg: 'bg-red-50' },
  { name: '대만', icon: '🧋', bg: 'bg-sky-50' },
  { name: '중국', icon: '🏮', bg: 'bg-orange-50' },
  { name: '베트남', icon: '🍜', bg: 'bg-amber-50' },
  { name: '그 외', icon: '🌏', bg: 'bg-blue-50' },
];

// 메인 상단 나라별 아이콘 (누르면 해당 나라 상품 목록으로 이동)
export default function CountryMenu() {
  return (
    // grid-cols-5: 모바일에서도 5개가 한 줄에 화면 너비에 맞게 들어감
    <section className="mx-auto mt-2 grid max-w-3xl grid-cols-5 gap-2 md:mt-4 md:gap-8">
      {countryMenus.map((c) => (
        <Link
          key={c.name}
          href={`/products?country=${encodeURIComponent(c.name)}`}
          className="flex flex-col items-center gap-2 hover:opacity-80"
        >
          {/* 동그라미 아이콘: 모바일 56px, PC 96px */}
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl md:h-24 md:w-24 md:text-5xl ${c.bg}`}
          >
            {c.icon}
          </span>
          <span className="text-xs font-medium text-gray-700 md:text-sm">{c.name}</span>
        </Link>
      ))}
    </section>
  );
}
