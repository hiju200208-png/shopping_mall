export type OrderInput = {
  buyerName: string;
  phone: string;
  zipcode: string;
  address1: string;
  address2: string;
};

export type OrderLine = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
};

export type Order = {
  orderId: string;
  status: string;
  orderedAt: string;
  totalPrice: number;
  buyer: OrderInput;
  items: OrderLine[];
  // ── 관리자 페이지에서 채우는 항목 (없어도 동작해요) ──
  courier?: string; // 택배사
  trackingNo?: string; // 운송장 번호
  history?: { status: string; at: string }[]; // 상태가 바뀐 기록
  adminNote?: string; // 관리자 메모 (지연 사유 등)
};

// 주문 상태 (주문하면 "접수"로 시작해요)
export const ORDER_STATUSES = [
  "접수",
  "상품준비중",
  "배송중",
  "배송완료",
  "배송지연",
  "주문취소",
] as const;

const LAST_ORDER_KEY = "gourmand-last-order"; // 방금 한 주문 (완료 페이지용)
const ORDERS_KEY = "gourmand-orders"; // 전체 주문 내역 (마이페이지용)
const SHIPPING_KEY = "gourmand-shipping"; // 저장된 배송 정보
const MAX_ORDERS = 50;

function makeOrderId() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `G${ymd}-${rand}`;
}

// 시연용: DB에 저장하지 않고 브라우저에만 보관해요.
// 나중에 DB로 확장할 때는 이 파일의 함수들만 API 호출로 바꾸면 돼요.
export function createOrder(
  input: OrderInput,
  items: OrderLine[],
  totalPrice: number
): Order {
  const order: Order = {
    orderId: makeOrderId(),
    status: "접수",
    orderedAt: new Date().toISOString(),
    totalPrice,
    buyer: input,
    items,
  };
  try {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {}
  try {
    const orders = [order, ...getOrders()].slice(0, MAX_ORDERS);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {}
  return order;
}

export function getLastOrder(): Order | null {
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}

// 최신 주문이 앞에 오도록 저장되어 있어요.
export function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function saveShipping(input: OrderInput) {
  try {
    localStorage.setItem(SHIPPING_KEY, JSON.stringify(input));
  } catch {}
}

export function getSavedShipping(): OrderInput | null {
  try {
    const raw = localStorage.getItem(SHIPPING_KEY);
    return raw ? (JSON.parse(raw) as OrderInput) : null;
  } catch {
    return null;
  }
}

// 관리자 페이지: 주문 한 건의 상태 · 운송장 등을 바꿔서 저장해요.
// 마이페이지는 같은 저장소를 읽기 때문에 바뀐 상태가 그대로 보여요.
export function updateOrder(orderId: string, patch: Partial<Order>): Order[] {
  const orders = getOrders().map((o) =>
    o.orderId === orderId ? { ...o, ...patch } : o
  );
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {}
  return orders;
}
