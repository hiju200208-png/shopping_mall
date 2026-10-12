import { products } from "@/data/products";
import { SAMPLE_PRODUCT_IDS, type ProductInfo } from "@/data/sampleOrders";
import { salePrice } from "@/lib/products";

import AdminDashboard from "@/components/admin/AdminDashboard";

// 관리자 · 주문/배송 관리 (/admin)
// 쇼핑몰 화면에는 이동 버튼이 없고 주소로만 들어옵니다.
export default function AdminPage() {
  // 예시 주문에 쓰이는 상품의 이름 · 판매가 · 이미지만 넘김
  const productMap: Record<number, ProductInfo> = {};
  products
    .filter((p) => SAMPLE_PRODUCT_IDS.includes(p.id))
    .forEach((p) => {
      productMap[p.id] = { name: p.name, price: salePrice(p), imageUrl: p.imageUrl };
    });

  return <AdminDashboard sampleProducts={productMap} />;
}
