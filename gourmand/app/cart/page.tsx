import CartView from "@/components/CartView";

export default function CartPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <h1 className="text-2xl font-bold text-gray-900">장바구니</h1>
      <CartView />
    </main>
  );
}