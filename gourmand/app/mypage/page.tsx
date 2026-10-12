import MyOrders from "@/components/MyOrders";

export const metadata = { title: "마이페이지 | 구르망" };

export default function MyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">마이페이지</h1>
      <MyOrders />
    </main>
  );
}