// 오류 페이지용 쿠키 그림 (404의 '0' = 한 입 베어 먹은 쿠키, 오류 = 반으로 부서진 쿠키)
export function BittenCookie({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <defs>
        <mask id="cookie-bite">
          <rect width="100" height="100" fill="#fff" />
          <circle cx="88" cy="18" r="16" fill="#000" />
          <circle cx="96" cy="38" r="10" fill="#000" />
        </mask>
      </defs>
      <circle cx="50" cy="52" r="44" fill="#d9a066" mask="url(#cookie-bite)" />
      <circle cx="50" cy="52" r="44" fill="none" stroke="#b97a3f" strokeWidth="3" mask="url(#cookie-bite)" />
      <circle cx="34" cy="40" r="6" fill="#4f200b" />
      <circle cx="58" cy="62" r="7" fill="#4f200b" />
      <circle cx="32" cy="70" r="5" fill="#4f200b" />
      <circle cx="62" cy="36" r="4" fill="#4f200b" />
      <circle cx="74" cy="72" r="4" fill="#4f200b" />
    </svg>
  );
}

export function BrokenCookie({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 132 104" aria-hidden="true" className={className}>
      <path d="M60 8 A44 44 0 0 0 60 96 L52 78 L64 62 L50 46 L62 30 Z" fill="#d9a066" stroke="#b97a3f" strokeWidth="3" strokeLinejoin="round" />
      <path d="M72 8 A44 44 0 0 1 72 96 L64 78 L76 62 L62 46 L74 30 Z" fill="#d9a066" stroke="#b97a3f" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="38" cy="40" r="6" fill="#4f200b" />
      <circle cx="34" cy="70" r="5" fill="#4f200b" />
      <circle cx="96" cy="44" r="6" fill="#4f200b" />
      <circle cx="92" cy="74" r="5" fill="#4f200b" />
      <circle cx="66" cy="100" r="2.5" fill="#b97a3f" />
      <circle cx="58" cy="102" r="1.8" fill="#b97a3f" />
      <circle cx="74" cy="101" r="1.8" fill="#b97a3f" />
    </svg>
  );
}
