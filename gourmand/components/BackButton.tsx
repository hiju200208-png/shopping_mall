"use client";

import { useRouter } from "next/navigation";

// '이전 페이지로' 버튼 (주소를 직접 입력해 들어와서 이전 기록이 없으면 홈으로)
export default function BackButton({ className = "" }: { className?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
      className={className}
    >
      이전 페이지로
    </button>
  );
}
