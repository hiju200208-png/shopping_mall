import Link from "next/link";

import {
  CATEGORY_FILTERS,
  COUNTRY_FILTERS,
  ProductQuery,
  SORT_OPTIONS,
} from "@/lib/products";

// 지금 조건에서 한 가지만 바꾼 주소 만들기 (나머지 조건은 유지)
function hrefWith(base: string, current: ProductQuery, change: ProductQuery) {
  const next = { ...current, ...change };
  const params = new URLSearchParams();
  (Object.keys(next) as (keyof ProductQuery)[]).forEach((key) => {
    const value = next[key];
    if (value && !(key === "sort" && value === "recommend")) {
      params.set(key, value);
    }
  });
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
        active
          ? "border-brand bg-brand text-white"
          : "border-gray-200 bg-white text-gray-700 hover:border-brand-line hover:bg-brand-soft"
      }`}
    >
      {children}
    </Link>
  );
}

// 나라 · 종류 · 정렬 필터 (링크 방식이라 새로고침·공유해도 조건 유지)
export default function ProductFilters({
  base,
  query,
}: {
  base: string;
  query: ProductQuery;
}) {
  const rows = [
    {
      label: "나라",
      key: "country" as const,
      options: COUNTRY_FILTERS,
    },
    {
      label: "종류",
      key: "category" as const,
      options: CATEGORY_FILTERS,
    },
  ];

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.key} className="flex items-center gap-3">
          <span className="w-8 shrink-0 text-sm font-semibold text-gray-500">
            {row.label}
          </span>
          <div className="-mr-4 flex gap-1.5 overflow-x-auto pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Chip
              href={hrefWith(base, query, { [row.key]: undefined })}
              active={!query[row.key]}
            >
              전체
            </Chip>
            {row.options.map((option) => (
              <Chip
                key={option.slug}
                href={hrefWith(base, query, { [row.key]: option.slug })}
                active={query[row.key] === option.slug}
              >
                {option.name}
              </Chip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// 정렬 링크 (결과 개수 오른쪽에 작게)
export function SortLinks({
  base,
  query,
}: {
  base: string;
  query: ProductQuery;
}) {
  const current = query.sort ?? "recommend";
  return (
    <div className="-mr-4 flex gap-3 overflow-x-auto pr-4 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {SORT_OPTIONS.map((option) => (
        <Link
          key={option.slug}
          href={hrefWith(base, query, { sort: option.slug })}
          scroll={false}
          aria-current={current === option.slug ? "true" : undefined}
          className={`shrink-0 transition ${
            current === option.slug
              ? "font-bold text-brand"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {option.name}
        </Link>
      ))}
    </div>
  );
}
