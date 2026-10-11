import Link from "next/link";

// 홈 화면의 섹션 묶음 (제목 + 부제 + 전체보기 링크)
export default function HomeSection({
  title,
  subtitle,
  href,
  children,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 md:mt-16">
      <div className="mb-4 flex items-end justify-between gap-4 md:mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 md:text-2xl">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        {href && (
          <Link
            href={href}
            className="shrink-0 text-sm font-semibold text-brand transition hover:text-brand-dark"
          >
            전체보기 ›
          </Link>
        )}
      </div>

      {children}
    </section>
  );
}
