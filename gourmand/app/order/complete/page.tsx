import OrderComplete from "@/components/OrderComplete";

export const metadata = { title: "주문 완료 | 구르망" };

export default function OrderCompletePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <OrderComplete />
    </main>
  );
}