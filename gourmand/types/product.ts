// 단위는 정해진 값만 쓰도록 제한
export type Unit = 'g' | 'kg' | 'ml' | 'L' | '개';
 
export interface Product {
  // ── 기본 정보 (발제 필수 규격) ──
  id: number;             // 상품 고유 식별자
  name: string;           // 상품명
  price: number;          // 정가 (원화 기준 숫자)
  country: string;        // 국가 (여행지)
  category: string;       // 카테고리 (과자, 초콜릿, 젤리·캔디, 음료, 견과류 등)
  imageUrl: string;       // 이미지 URL (무료 이미지 또는 대체 이미지)
  description: string;    // 상품 요약 설명
  isNew?: boolean;        // 신상품 여부 (선택)
 
  // ── 판매 정보 ──
  discountPrice?: number; // 할인판매금액 (할인 없으면 생략)
  rating: number;         // 평점 (0 ~ 5)
  reviewCount: number;    // 리뷰수
  stock: number;          // 재고 수량
  isSoldOut: boolean;     // 품절 여부
 
  // ── 배송 정보 ──
  deliveryDays: number;   // 예상배송기간 (일 단위)
 
  // ── 상품 상세 정보 ──
  volume: number;         // 내용량 (1봉/1개 기준, 예: 60)
  unit: Unit;             // 단위 (예: 'g')
  itemCount: number;      // 내용물 개수 (예: 5봉 묶음이면 5)
  origin: string;         // 원산지 (주원료 기준)
  foodType: string;       // 식품유형 (예: 과자, 캔디류, 초콜릿가공품)
  manufacturer: string;   // 제조사
  storageMethod: string;  // 보관방법 (예: 직사광선을 피해 서늘한 곳에 보관)
}
