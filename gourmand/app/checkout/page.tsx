import CheckoutForm from "@/components/CheckoutForm";

export const metadata = { title: "주문하기 | 구르망" };

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">주문하기</h1>
      <CheckoutForm />
    </main>
  );
}