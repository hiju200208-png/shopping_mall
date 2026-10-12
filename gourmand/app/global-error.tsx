"use client";

// 헤더·레이아웃까지 망가지는 아주 드문 경우를 위한 마지막 안전망
// (이때는 globals.css도 못 쓸 수 있어서 스타일을 직접 적어요)
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f8efe7",
          color: "#2A1A12",
          textAlign: "center",
          padding: 24,
        }}
      >
        <main>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#6b2f14" }}>구르망</p>
          <h1 style={{ margin: "20px 0 0", fontSize: 24, fontWeight: 800 }}>잠시 문제가 생겼어요</h1>
          <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.6, color: "#6E5B50" }}>
            페이지를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{ height: 48, padding: "0 24px", border: 0, borderRadius: 999, background: "#6b2f14", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}
            >
              다시 시도
            </button>
            {/* 레이아웃이 망가진 상태라 Link 대신 a로 새로 불러와요 */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{ height: 48, padding: "0 24px", borderRadius: 999, border: "1.5px solid #6b2f14", color: "#6b2f14", fontSize: 16, fontWeight: 700, display: "inline-flex", alignItems: "center", textDecoration: "none" }}
            >
              홈으로 가기
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
