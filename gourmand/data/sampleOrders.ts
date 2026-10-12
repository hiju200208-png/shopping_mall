import type { Order } from "@/lib/orderStorage";

// 관리자 페이지 시연용 예시 주문 14건
// - 실제 주문(브라우저에 저장된 주문)과 함께 관리자 화면에 '예시' 표시로 보여요.
// - 주문자 · 주소 · 운송장 번호는 만든 값이고, 상품은 data/products.ts의 실제 상품이에요.
// - 시각은 "지금으로부터 몇 분 전"으로 적어서 언제 열어도 최근 주문처럼 보여요.

type SampleDef = {
  minutesAgo: number; // 주문 시각
  name: string;
  phone: string;
  zipcode: string;
  address1: string;
  address2: string;
  items: [productId: number, qty: number][];
  // 상태 기록: [상태, 주문 후 몇 분 뒤]
  history: [status: string, afterMinutes: number][];
  courier?: string;
  trackingNo?: string;
  adminNote?: string;
};

const DEFS: SampleDef[] = [
  { minutesAgo: 18, name: "김서연", phone: "010-5521-2741", zipcode: "03937", address1: "서울 마포구 월드컵북로 12길 8", address2: "302호", items: [[4, 2], [6, 1]], history: [["접수", 0]] },
  { minutesAgo: 39, name: "박준호", phone: "010-8830-9015", zipcode: "13561", address1: "경기 성남시 분당구 정자일로 95", address2: "1204호", items: [[11, 1], [12, 3]], history: [["접수", 0]] },
  { minutesAgo: 125, name: "이하은", phone: "010-2297-3388", zipcode: "48058", address1: "부산 해운대구 센텀중앙로 48", address2: "701호", items: [[41, 2], [46, 2], [58, 1]], history: [["접수", 0], ["상품준비중", 75]] },
  { minutesAgo: 203, name: "정민재", phone: "010-4415-6120", zipcode: "42020", address1: "대구 수성구 달구벌대로 2450", address2: "3층", items: [[22, 1]], history: [["접수", 0], ["상품준비중", 75]] },
  { minutesAgo: 290, name: "최유나", phone: "010-7762-4472", zipcode: "21998", address1: "인천 연수구 컨벤시아대로 165", address2: "902호", items: [[3, 4], [8, 2]], history: [["접수", 0], ["상품준비중", 80]] },
  { minutesAgo: 356, name: "한도윤", phone: "010-3308-8806", zipcode: "05551", address1: "서울 송파구 올림픽로 300", address2: "2201호", items: [[26, 1], [31, 2]], history: [["접수", 0], ["상품준비중", 51], ["배송중", 266]], courier: "CJ대한통운", trackingNo: "6874-1023-5531" },
  { minutesAgo: 1000, name: "오지민", phone: "010-6604-1953", zipcode: "61949", address1: "광주 서구 상무중앙로 110", address2: "503호", items: [[53, 2], [58, 2]], history: [["접수", 0], ["상품준비중", 630], ["배송중", 765]], courier: "우체국택배", trackingNo: "6091-2284-7710" },
  { minutesAgo: 1207, name: "윤채원", phone: "010-9145-7264", zipcode: "34134", address1: "대전 유성구 대학로 99", address2: "학생회관", items: [[1, 6]], history: [["접수", 0], ["상품준비중", 87], ["배송중", 887]], courier: "한진택배", trackingNo: "5310-8842-1167" },
  { minutesAgo: 1365, name: "강태현", phone: "010-2856-3510", zipcode: "16514", address1: "경기 수원시 영통구 광교중앙로 140", address2: "1503호", items: [[11, 2], [4, 1]], history: [["접수", 0], ["상품준비중", 45], ["배송중", 125], ["배송지연", 1200]], courier: "CJ대한통운", trackingNo: "6874-0988-2210", adminNote: "택배사 물량 증가로 하루 지연 중이에요. 고객 안내가 아직 안 됐어요." },
  { minutesAgo: 2518, name: "서지우", phone: "010-5073-0627", zipcode: "63092", address1: "제주 제주시 노형로 407", address2: "805호", items: [[35, 3], [31, 1]], history: [["접수", 0], ["상품준비중", 738], ["배송중", 1008], ["배송지연", 2300]], courier: "우체국택배", trackingNo: "6091-2190-4458", adminNote: "제주 지역 기상 악화로 배송이 늦어지고 있어요." },
  { minutesAgo: 2860, name: "임하준", phone: "010-6391-5842", zipcode: "44677", address1: "울산 남구 삼산로 274", address2: "1102호", items: [[41, 1], [46, 1]], history: [["접수", 0], ["상품준비중", 70], ["배송중", 1125], ["배송완료", 2750]], courier: "한진택배", trackingNo: "5310-8790-3344" },
  { minutesAgo: 3128, name: "송예린", phone: "010-8217-1179", zipcode: "06236", address1: "서울 강남구 테헤란로 152", address2: "15층", items: [[6, 2]], history: [["접수", 0], ["상품준비중", 118], ["배송중", 403], ["배송완료", 1623]], courier: "CJ대한통운", trackingNo: "6874-0875-6619" },
  { minutesAgo: 3985, name: "배수아", phone: "010-4482-9360", zipcode: "10403", address1: "경기 고양시 일산동구 중앙로 1275", address2: "601호", items: [[12, 2], [1, 2]], history: [["접수", 0], ["상품준비중", 755], ["배송중", 1105], ["배송완료", 2395]], courier: "우체국택배", trackingNo: "6091-2011-8835" },
  { minutesAgo: 4412, name: "조은우", phone: "010-1736-2486", zipcode: "28581", address1: "충북 청주시 흥덕구 대농로 17", address2: "304호", items: [[58, 3]], history: [["접수", 0], ["주문취소", 104]], adminNote: "고객 요청으로 취소 · 환불 완료" },
];

export type ProductInfo = { name: string; price: number; imageUrl: string };

// 예시 주문에 쓰이는 상품 번호 (관리자 페이지가 이 상품들의 정보만 넘겨받아요)
export const SAMPLE_PRODUCT_IDS = Array.from(
  new Set(DEFS.flatMap((d) => d.items.map(([id]) => id)))
);

function orderIdOf(date: Date, seq: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `G${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${String(9000 + seq).padStart(4, "0")}`;
}

// 지금 시각을 기준으로 예시 주문을 만들어요 (브라우저에서 호출)
export function buildSampleOrders(now: Date, products: Record<number, ProductInfo>): Order[] {
  return DEFS.map((d, index) => {
    const orderedAt = new Date(now.getTime() - d.minutesAgo * 60_000);
    const items = d.items.map(([id, quantity]) => ({
      id,
      name: products[id]?.name ?? `상품 ${id}`,
      imageUrl: products[id]?.imageUrl ?? "",
      price: products[id]?.price ?? 0,
      quantity,
    }));
    const history = d.history.map(([status, after]) => ({
      status,
      at: new Date(orderedAt.getTime() + after * 60_000).toISOString(),
    }));
    return {
      orderId: orderIdOf(orderedAt, DEFS.length - index),
      status: history[history.length - 1].status,
      orderedAt: orderedAt.toISOString(),
      totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      buyer: {
        buyerName: d.name,
        phone: d.phone,
        zipcode: d.zipcode,
        address1: d.address1,
        address2: d.address2,
      },
      items,
      courier: d.courier,
      trackingNo: d.trackingNo,
      history,
      adminNote: d.adminNote,
    };
  });
}
