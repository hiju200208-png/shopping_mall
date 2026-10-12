"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { getOrders, updateOrder, ORDER_STATUSES, type Order } from "@/lib/orderStorage";
import { buildSampleOrders, type ProductInfo } from "@/data/sampleOrders";

type Status = (typeof ORDER_STATUSES)[number];
type Row = { order: Order; sample: boolean };

// ── 배송 상태 표시 (색 + 글자로 구분) ──
const STATUS_STYLE: Record<Status, { badge: string; dot: string }> = {
  접수: { badge: "bg-[#EEF0F3] text-[#384250]", dot: "bg-[#384250]" },
  상품준비중: { badge: "bg-[#FFF0D4] text-[#7A4A00]", dot: "bg-[#7A4A00]" },
  배송중: { badge: "bg-[#E2EDFA] text-[#1D4B85]", dot: "bg-[#1D4B85]" },
  배송완료: { badge: "bg-[#E1F2E6] text-[#1D6436]", dot: "bg-[#1D6436]" },
  배송지연: { badge: "bg-[#FCE3EB] text-[#9B1239]", dot: "bg-[#9B1239]" },
  주문취소: { badge: "bg-[#F0EEEC] text-[#5F5550]", dot: "bg-[#5F5550]" },
};
const styleOf = (s: string) => STATUS_STYLE[s as Status] ?? STATUS_STYLE["접수"];

const STEPS = ["접수", "상품준비중", "배송중", "배송완료"];
const STEP_INDEX: Record<string, number> = { 접수: 0, 상품준비중: 1, 배송중: 2, 배송지연: 2, 배송완료: 3 };
const COURIERS = ["CJ대한통운", "우체국택배", "한진택배", "롯데택배"];

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (iso: string) => {
  const d = new Date(iso);
  return `${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const sameDay = (iso: string, now: Date) => {
  const d = new Date(iso);
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
};
const unitsOf = (o: Order) => o.items.reduce((s, i) => s + i.quantity, 0);
// 상태 기록이 없는 실제 주문은 주문 시각을 '접수'로 봐요
const historyOf = (o: Order) => (o.history?.length ? o.history : [{ status: "접수", at: o.orderedAt }]);

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${styleOf(status).badge}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function AdminDashboard({ sampleProducts }: { sampleProducts: Record<number, ProductInfo> }) {
  const [realOrders, setRealOrders] = useState<Order[]>([]);
  const [sampleOrders, setSampleOrders] = useState<Order[]>([]);
  const [now, setNow] = useState<Date | null>(null);
  const [filter, setFilter] = useState<"전체" | Status>("전체");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [courier, setCourier] = useState(COURIERS[0]);
  const [trackingNo, setTrackingNo] = useState("");

  // 브라우저 저장소는 화면이 뜬 뒤에만 읽을 수 있어요
  useEffect(() => {
    const current = new Date();
    const real = getOrders();
    const samples = buildSampleOrders(current, sampleProducts);
    setNow(current);
    setRealOrders(real);
    setSampleOrders(samples);
    // 처음엔 실제 주문 중 가장 최근 것, 없으면 지연된 예시 주문을 열어 둠
    setSelectedId(real[0]?.orderId ?? samples.find((o) => o.status === "배송지연")?.orderId ?? null);

    // 다른 탭에서 새 주문이 들어오면 목록 갱신
    const onStorage = () => setRealOrders(getOrders());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [sampleProducts]);

  // 실제 주문 + 예시 주문, 최근 주문이 위로
  const rows: Row[] = useMemo(
    () =>
      [
        ...realOrders.map((order) => ({ order, sample: false })),
        ...sampleOrders.map((order) => ({ order, sample: true })),
      ].sort((a, b) => b.order.orderedAt.localeCompare(a.order.orderedAt)),
    [realOrders, sampleOrders]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { 전체: rows.length };
    rows.forEach(({ order }) => (c[order.status] = (c[order.status] ?? 0) + 1));
    return c;
  }, [rows]);

  const top = useMemo(() => {
    const tally = new Map<number, { name: string; imageUrl: string; units: number }>();
    rows.forEach(({ order }) => {
      if (order.status === "주문취소") return;
      order.items.forEach((i) => {
        const t = tally.get(i.id) ?? { name: i.name, imageUrl: i.imageUrl, units: 0 };
        t.units += i.quantity;
        tally.set(i.id, t);
      });
    });
    const ranked = [...tally.entries()].sort((a, b) => b[1].units - a[1].units || a[0] - b[0]).slice(0, 5);
    const max = ranked[0]?.[1].units ?? 1;
    return ranked.map(([id, t]) => ({ id, ...t, pct: Math.round((t.units / max) * 100) }));
  }, [rows]);

  if (!now) {
    return <p className="py-32 text-center text-[#6E5B50]">주문을 불러오는 중이에요…</p>;
  }

  // 오늘 요약
  const todayRows = rows.filter(({ order }) => sameDay(order.orderedAt, now));
  const todayLive = todayRows.filter(({ order }) => order.status !== "주문취소");
  const todaySales = todayLive.reduce((s, { order }) => s + order.totalPrice, 0);
  const todayUnits = todayLive.reduce((s, { order }) => s + unitsOf(order), 0);
  const waiting = (counts["접수"] ?? 0) + (counts["상품준비중"] ?? 0);
  const kpis = [
    { label: "오늘 주문", value: `${todayRows.length}건`, sub: `상품 ${todayUnits}개 · 실제 주문 ${realOrders.filter((o) => sameDay(o.orderedAt, now)).length}건`, warn: false },
    { label: "오늘 매출", value: won(todaySales), sub: `평균 ${won(Math.round(todaySales / Math.max(1, todayLive.length)))} / 주문`, warn: false },
    { label: "출고 대기", value: `${waiting}건`, sub: `접수 ${counts["접수"] ?? 0} · 상품준비중 ${counts["상품준비중"] ?? 0}`, warn: false },
    { label: "배송 지연", value: `${counts["배송지연"] ?? 0}건`, sub: "고객 안내가 필요해요", warn: true },
  ];

  // 상태 탭 + 검색 (주문번호 · 주문자 · 연락처 · 상품명, 띄어쓰기 무시)
  const keyword = query.toLowerCase().replace(/\s+/g, "");
  const visible = rows.filter(({ order }) => {
    if (filter !== "전체" && order.status !== filter) return false;
    if (!keyword) return true;
    const hay = [order.orderId, order.buyer.buyerName, order.buyer.phone, ...order.items.map((i) => i.name)]
      .join("")
      .toLowerCase()
      .replace(/\s+/g, "");
    return hay.includes(keyword);
  });

  const selected = rows.find(({ order }) => order.orderId === selectedId) ?? rows[0];

  // 상태 바꾸기: 실제 주문은 브라우저 저장소에 저장(마이페이지에도 반영), 예시 주문은 화면에서만
  function change(row: Row, status: Status, extra: Partial<Order> = {}) {
    const patch: Partial<Order> = {
      ...extra,
      status,
      history: [...historyOf(row.order), { status, at: new Date().toISOString() }],
    };
    if (row.sample) {
      setSampleOrders((list) => list.map((o) => (o.orderId === row.order.orderId ? { ...o, ...patch } : o)));
    } else {
      setRealOrders(updateOrder(row.order.orderId, patch));
    }
  }

  return (
    <div className="flex min-h-screen flex-wrap bg-[#FBF8F5] text-[14px] leading-normal text-[#2A1A12]">
      {/* ── 사이드바 ── */}
      <aside className="flex flex-[1_1_232px] flex-col gap-4 bg-[#3E1A08] px-4 py-4 text-[#F3E6DA] lg:gap-7 lg:py-6">
        <div className="flex items-center justify-center rounded-2xl bg-[#FBF3EA] px-3 py-2 lg:py-2.5">
          <img src="/images/common/logo.png" alt="구르망 GOURMAND" className="h-10 w-auto lg:h-[52px]" />
        </div>
        <p className="-mb-4 hidden px-3 text-[11px] font-bold tracking-[0.12em] text-[#C9A58C] lg:block">ADMIN</p>
        <nav aria-label="관리자 메뉴" className="flex flex-col gap-1">
          <span aria-current="page" className="flex items-center gap-3 rounded-[10px] bg-[#FBF3EA] px-3 py-[11px] font-bold text-[#3E1A08]">
            <Icon d="M3 7h11v10H3zM14 10h4l3 3v4h-7M5.2 18a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0M15.7 18a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0" />
            주문·배송 관리
            <span className="ml-auto rounded-full bg-accent px-2 text-[11px] font-bold tabular-nums text-white">{waiting}</span>
          </span>
          {[
            { label: "대시보드", d: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z" },
            { label: "상품 관리", d: "M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" },
            { label: "회원 관리", d: "M5.5 8a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c1.8.7 3 2.4 3.5 5.2" },
            { label: "리뷰 관리", d: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" },
          ].map((m) => (
            <span key={m.label} aria-disabled="true" className="hidden items-center gap-3 lg:flex rounded-[10px] px-3 py-[11px] font-medium text-[#E7D3C2]">
              <Icon d={m.d} />
              {m.label}
              <span className="ml-auto text-[11px] text-[#C9A58C]">준비 중</span>
            </span>
          ))}
        </nav>
        <div className="mt-auto hidden flex-col gap-3 lg:flex">
          <Link href="/" className="flex items-center gap-2 px-3 text-[13px] text-[#E7D3C2] hover:text-white">
            <Icon d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
            쇼핑몰 화면 보기
          </Link>
          <div className="flex items-center gap-2.5 border-t border-[#F3E6DA]/20 px-3 pt-3.5">
            <span aria-hidden="true" className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-accent text-[13px] font-bold text-white">관</span>
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-bold">크런치클럽 관리자</span>
              <span className="text-xs text-[#C9A58C]">admin@gourmand</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── 본문 ── */}
      <main className="flex min-w-0 flex-[999_1_560px] flex-col gap-6 px-5 pb-14 pt-8 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[28px] font-extrabold tracking-tight">주문·배송 관리</h1>
            <p className="text-[#6E5B50]">
              {now.getFullYear()}년 {now.getMonth() + 1}월 {now.getDate()}일 {pad(now.getHours())}:{pad(now.getMinutes())} 기준 · 실제 주문 {realOrders.length}건 + 예시 주문 {sampleOrders.length}건
            </p>
          </div>
          <label className="flex h-11 w-[300px] max-w-full items-center gap-2 rounded-xl border border-[#E3D5CA] bg-white px-3.5 text-[#6E5B50] focus-within:border-brand">
            <svg aria-hidden="true" className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="M16 16l4.5 4.5" />
            </svg>
            <span className="sr-only">주문 검색</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="주문번호, 주문자, 연락처, 상품명"
              className="min-w-0 flex-1 bg-transparent text-[#2A1A12] outline-none placeholder:text-[#8A7769]"
            />
          </label>
        </div>

        {/* 오늘 요약 */}
        <section aria-label="오늘 요약" className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 md:gap-4">
          {kpis.map((k) => (
            <div key={k.label} className="flex flex-col gap-1.5 rounded-2xl border border-[#EADFD6] bg-white px-5 py-[18px]">
              <span className="text-[13px] font-medium text-[#6E5B50]">{k.label}</span>
              <span className={`text-[28px] font-extrabold tabular-nums tracking-tight ${k.warn ? "text-[#9B1239]" : ""}`}>{k.value}</span>
              <span className="text-xs text-[#6E5B50]">{k.sub}</span>
            </div>
          ))}
        </section>

        {/* 배송 상태 탭 */}
        <div role="group" aria-label="배송 상태로 거르기" className="flex flex-wrap gap-2">
          {(["전체", ...ORDER_STATUSES] as const).map((key) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={active}
                className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 transition ${
                  active ? "border-[#3E1A08] bg-[#3E1A08] font-bold text-white" : "border-[#E3D5CA] bg-white font-medium text-[#3E1A08] hover:border-[#C9A58C]"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${key === "전체" ? "bg-brand" : styleOf(key).dot} ${active ? "ring-2 ring-white/60" : ""}`} />
                {key}
                <span className="font-bold tabular-nums">{counts[key] ?? 0}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-start gap-6">
          <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-6">
            {/* 주문 목록 */}
            <section aria-label="주문 목록" className="overflow-hidden rounded-2xl border border-[#EADFD6] bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-[#EADFD6] px-5 py-4">
                <h2 className="text-base font-bold">
                  주문 목록 <span className="font-medium tabular-nums text-[#6E5B50]">{visible.length}건</span>
                </h2>
                <span className="text-xs text-[#6E5B50]">주문번호를 누르면 상세가 열려요</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] table-fixed text-left">
                  <thead className="bg-[#FBF8F5] text-xs font-bold text-[#6E5B50]">
                    <tr>
                      <th scope="col" className="w-[190px] px-5 py-2.5">주문번호 · 일시</th>
                      <th scope="col" className="w-[110px] py-2.5">주문자</th>
                      <th scope="col" className="py-2.5">주문 상품</th>
                      <th scope="col" className="w-[110px] py-2.5 text-right">결제금액</th>
                      <th scope="col" className="w-[132px] px-5 py-2.5">배송 상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((row) => {
                      const o = row.order;
                      const first = o.items[0];
                      const isSel = o.orderId === selected?.order.orderId;
                      return (
                        <tr key={o.orderId} className={`border-t border-[#F1E8E0] ${isSel ? "bg-brand-soft shadow-[inset_3px_0_0_var(--brand)]" : "hover:bg-[#FCF7F2]"}`}>
                          <td className="px-5 py-3">
                            <button
                              type="button"
                              onClick={() => setSelectedId(o.orderId)}
                              aria-label={`${o.orderId} 주문 상세 보기`}
                              className="whitespace-nowrap text-left font-bold tabular-nums text-brand underline underline-offset-[3px]"
                            >
                              {o.orderId}
                            </button>
                            <div className="flex items-center gap-1.5 whitespace-nowrap text-xs tabular-nums text-[#6E5B50]">
                              {fmt(o.orderedAt)}
                              {row.sample ? (
                                <span className="rounded bg-[#F0EEEC] px-1.5 text-[11px] font-medium text-[#5F5550]">예시</span>
                              ) : (
                                <span className="rounded bg-accent px-1.5 text-[11px] font-bold text-white">실제</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="truncate whitespace-nowrap font-medium">{o.buyer.buyerName}</div>
                            <div className="truncate whitespace-nowrap text-xs text-[#6E5B50]">{o.buyer.address1.split(" ").slice(0, 2).join(" ")}</div>
                          </td>
                          <td className="py-3 pr-3">
                            <div className="flex min-w-0 items-center gap-2.5">
                              <img src={first?.imageUrl} alt="" className="h-10 w-10 flex-none rounded-lg border border-[#EADFD6] object-cover" />
                              <div className="min-w-0">
                                <div className="truncate">
                                  {first?.name}
                                  {o.items.length > 1 && ` 외 ${o.items.length - 1}건`}
                                </div>
                                <div className="text-xs tabular-nums text-[#6E5B50]">총 {unitsOf(o)}개</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-3 text-right font-bold tabular-nums">{won(o.totalPrice)}</td>
                          <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {visible.length === 0 && (
                  <p className="px-5 py-12 text-center text-[#6E5B50]">조건에 맞는 주문이 없어요. 검색어나 상태를 바꿔 보세요.</p>
                )}
              </div>
            </section>

            {/* 많이 주문된 상품 */}
            <section aria-label="많이 주문된 상품" className="flex flex-col gap-3.5 rounded-2xl border border-[#EADFD6] bg-white px-5 py-[18px]">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-base font-bold">많이 주문된 상품 TOP 5</h2>
                <span className="text-xs text-[#6E5B50]">취소 제외 · 수량 기준</span>
              </div>
              {top.map((t, i) => (
                <div key={t.id} className="grid grid-cols-[22px_36px_minmax(120px,220px)_minmax(80px,1fr)_56px] items-center gap-3">
                  <span className="font-extrabold tabular-nums text-brand">{i + 1}</span>
                  <img src={t.imageUrl} alt="" className="h-9 w-9 rounded-lg border border-[#EADFD6] object-cover" />
                  <span className="truncate">{t.name}</span>
                  <span className="block h-2.5 overflow-hidden rounded-full bg-[#F3EAE2]">
                    <span className="block h-full rounded-full bg-brand" style={{ width: `${t.pct}%` }} />
                  </span>
                  <span className="text-right font-bold tabular-nums">{t.units}개</span>
                </div>
              ))}
            </section>
          </div>

          {/* 주문 상세 */}
          {selected && (
            <OrderDetail
              row={selected}
              courier={courier}
              trackingNo={trackingNo}
              onCourier={setCourier}
              onTracking={setTrackingNo}
              onChange={(status, extra) => {
                change(selected, status, extra);
                setTrackingNo("");
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// ── 주문 상세 패널 ──
function OrderDetail({
  row,
  courier,
  trackingNo,
  onCourier,
  onTracking,
  onChange,
}: {
  row: Row;
  courier: string;
  trackingNo: string;
  onCourier: (v: string) => void;
  onTracking: (v: string) => void;
  onChange: (status: Status, extra?: Partial<Order>) => void;
}) {
  const o = row.order;
  const history = historyOf(o);
  const timeOf = (status: string) => [...history].reverse().find((h) => h.status === status)?.at;
  const reached = o.status === "주문취소"
    ? Math.max(...history.map((h) => STEP_INDEX[h.status] ?? 0))
    : STEP_INDEX[o.status] ?? 0;
  const delayed = o.status === "배송지연";
  const canceled = o.status === "주문취소";

  const secondary = "h-11 flex-1 rounded-xl border border-[#E3D5CA] bg-white font-bold text-[#3E1A08] transition hover:bg-[#FBF8F5]";
  const primary = "h-12 w-full rounded-xl bg-brand text-[15px] font-bold text-white transition hover:bg-brand-dark";

  return (
    <aside aria-label="주문 상세" className="min-w-0 flex-[1_1_340px] overflow-hidden rounded-2xl border border-[#EADFD6] bg-white">
      <div className="flex flex-col gap-2 border-b border-[#EADFD6] px-5 py-[18px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#6E5B50]">주문 상세 · {row.sample ? "예시 주문" : "실제 주문"}</span>
          <StatusBadge status={o.status} />
        </div>
        <h2 className="text-xl font-extrabold tabular-nums">{o.orderId}</h2>
        <span className="text-[13px] tabular-nums text-[#6E5B50]">{fmt(o.orderedAt)} 주문</span>
      </div>

      {o.adminNote && (
        <p className={`mx-5 mt-4 rounded-[10px] px-3 py-2.5 text-[13px] font-medium ${delayed ? "bg-[#FCE3EB] text-[#9B1239]" : "bg-[#F0EEEC] text-[#5F5550]"}`}>
          {o.adminNote}
        </p>
      )}

      {/* 주문자 */}
      <dl className="grid grid-cols-[64px_1fr] gap-x-3 gap-y-2 border-b border-[#EADFD6] px-5 py-4 text-[13px]">
        <dt className="text-[#6E5B50]">주문자</dt>
        <dd className="font-bold">{o.buyer.buyerName}</dd>
        <dt className="text-[#6E5B50]">연락처</dt>
        <dd className="tabular-nums">{o.buyer.phone}</dd>
        <dt className="text-[#6E5B50]">배송지</dt>
        <dd>({o.buyer.zipcode}) {o.buyer.address1} {o.buyer.address2}</dd>
      </dl>

      {/* 주문 상품 */}
      <div className="flex flex-col gap-3 border-b border-[#EADFD6] px-5 py-4">
        <h3 className="text-sm font-bold">
          주문 상품 <span className="font-medium tabular-nums text-[#6E5B50]">{o.items.length}종 · {unitsOf(o)}개</span>
        </h3>
        {o.items.map((i) => (
          <div key={i.id} className="flex items-center gap-2.5">
            <img src={i.imageUrl} alt="" className="h-11 w-11 flex-none rounded-lg border border-[#EADFD6] object-cover" />
            <div className="min-w-0 flex-1">
              <Link href={`/products/${i.id}`} className="text-[13px] font-medium hover:underline">{i.name}</Link>
              <div className="text-xs tabular-nums text-[#6E5B50]">{won(i.price)} × {i.quantity}개</div>
            </div>
            <span className="text-[13px] font-bold tabular-nums">{won(i.price * i.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-dashed border-[#E3D5CA] pt-2.5 text-[13px]">
          <span className="font-bold">결제 금액</span>
          <span className="text-base font-extrabold tabular-nums text-brand">{won(o.totalPrice)}</span>
        </div>
      </div>

      {/* 배송 진행 */}
      <div className="border-b border-[#EADFD6] px-5 py-4">
        <h3 className="mb-2 text-sm font-bold">배송 진행</h3>
        <ol>
          {STEPS.map((label, i) => {
            const done = i <= reached && !(canceled && !timeOf(label));
            const current = !canceled && i === reached && o.status !== "배송완료";
            const warn = delayed && i === 2;
            const at = warn ? timeOf("배송지연") : timeOf(label);
            return (
              <li key={label} className="grid grid-cols-[20px_1fr] gap-x-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`rounded-full ${current ? "mt-[3px] h-3.5 w-3.5" : "mt-[5px] h-2.5 w-2.5"} ${
                      done ? (warn ? "bg-[#9B1239]" : "bg-brand") : "border-2 border-[#D9CBBF] bg-white"
                    } ${current ? (warn ? "ring-4 ring-[#FCE3EB]" : "ring-4 ring-[#F3E6DA]") : ""}`}
                  />
                  {i < 3 && <span className={`mt-1 w-0.5 flex-1 ${done && i < reached ? "bg-brand" : "bg-[#E8DDD3]"}`} />}
                </div>
                <div className="flex flex-col pb-3.5">
                  <span className={`text-[13px] ${done ? "font-bold" : "font-medium text-[#8A7769]"} ${warn ? "text-[#9B1239]" : ""}`}>
                    {warn ? "배송중 · 지연" : label}
                  </span>
                  <span className="text-xs tabular-nums text-[#6E5B50]">
                    {done && at ? fmt(at) : canceled ? "취소로 진행 안 함" : "대기"}
                  </span>
                  {i === 2 && o.courier && (
                    <span className="text-xs font-medium tabular-nums text-[#1D4B85]">{o.courier} {o.trackingNo}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
        {canceled && (
          <p className="text-xs font-medium text-[#5F5550]">주문취소 · {fmt(timeOf("주문취소") ?? o.orderedAt)}</p>
        )}
      </div>

      {/* 처리 */}
      <div className="flex flex-col gap-2.5 px-5 pb-5 pt-4">
        {o.status === "접수" && (
          <>
            <button type="button" className={primary} onClick={() => onChange("상품준비중")}>상품 준비 시작</button>
            <div className="flex gap-2">
              <button type="button" className={secondary} onClick={() => onChange("주문취소", { adminNote: "관리자 취소 처리" })}>주문 취소</button>
            </div>
          </>
        )}

        {o.status === "상품준비중" && (
          <>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <label className="sr-only" htmlFor="admin-courier">택배사</label>
              <select
                id="admin-courier"
                value={courier}
                onChange={(e) => onCourier(e.target.value)}
                className="h-11 rounded-xl border border-[#E3D5CA] bg-white px-2 text-[13px] outline-none focus:border-brand"
              >
                {COURIERS.map((c) => <option key={c}>{c}</option>)}
              </select>
              <label className="sr-only" htmlFor="admin-tracking">운송장 번호</label>
              <input
                id="admin-tracking"
                value={trackingNo}
                onChange={(e) => onTracking(e.target.value)}
                placeholder="운송장 번호"
                inputMode="numeric"
                className="h-11 min-w-0 rounded-xl border border-[#E3D5CA] px-3 text-[13px] tabular-nums outline-none focus:border-brand"
              />
            </div>
            <button
              type="button"
              className={primary}
              onClick={() => onChange("배송중", { courier, trackingNo: trackingNo.trim() || "운송장 미입력" })}
            >
              출고 처리 (배송중으로 변경)
            </button>
            <div className="flex gap-2">
              <button type="button" className={secondary} onClick={() => onChange("주문취소", { adminNote: "관리자 취소 처리" })}>주문 취소</button>
            </div>
          </>
        )}

        {o.status === "배송중" && (
          <>
            <button type="button" className={primary} onClick={() => onChange("배송완료")}>배송완료로 변경</button>
            <div className="flex gap-2">
              <button type="button" className={secondary} onClick={() => onChange("배송지연", { adminNote: "배송이 늦어지고 있어요. 고객 안내가 필요해요." })}>
                배송 지연으로 표시
              </button>
            </div>
          </>
        )}

        {o.status === "배송지연" && (
          <>
            <button type="button" className={primary} onClick={() => onChange("배송완료", { adminNote: undefined })}>배송완료로 변경</button>
            <div className="flex gap-2">
              <button type="button" className={secondary} onClick={() => onChange("배송중", { adminNote: undefined })}>배송 재개 (배송중으로)</button>
            </div>
          </>
        )}

        {(o.status === "배송완료" || canceled) && (
          <button type="button" disabled className="h-12 w-full cursor-not-allowed rounded-xl bg-[#EDE6E0] text-[15px] font-bold text-[#6E5B50]">
            {canceled ? "취소된 주문이에요" : "처리가 끝난 주문이에요"}
          </button>
        )}

        <p className="text-center text-xs text-[#6E5B50]">
          {row.sample
            ? "예시 주문이라 새로고침하면 처음 상태로 돌아가요."
            : "바꾼 상태는 이 브라우저에 저장되고, 고객 마이페이지에도 보여요."}
        </p>
      </div>
    </aside>
  );
}
