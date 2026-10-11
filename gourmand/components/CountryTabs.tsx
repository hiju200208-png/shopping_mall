import Link from "next/link";

const tabs = [
  { name: "일본", slug: "japan", icon: "⛩️" },
  { name: "대만", slug: "taiwan", icon: "🧋" },
  { name: "중국", slug: "china", icon: "🏮" },
  { name: "베트남", slug: "vietnam", icon: "🍜" },
  { name: "그 외", slug: "other", icon: "🌏" },
];

// 나라별 페이지 상단의 나라 전환 탭 (현재 나라는 브라운으로 강조)
export default function CountryTabs({ active }: { active: string }) {
  return (
    <nav
      aria-label="나라 선택"
      className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((tab) => {
        const isActive = tab.slug === active;
        return (
          <Link
            key={tab.slug}
            href={`/country/${tab.slug}`}
            aria-current={isActive ? "page" : undefined}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-semibold sm:px-4 sm:text-[15px] transition ${
              isActive
                ? "border-brand bg-brand text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-brand-line hover:bg-brand-soft"
            }`}
          >
            <span aria-hidden="true" className="hidden sm:inline">
              {tab.icon}
            </span>
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
