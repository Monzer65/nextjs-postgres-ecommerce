import HeaderAdmin from "@/components/admin-header";
import RecentOrders from "@/components/recent-orders";
import SummaryCards from "@/components/summary-cards";

export default async function Dashboardpage() {
  const items = [
    { href: "/admin", label: "خانه" },
    { label: "داشبورد" },
  ]
  return (
    <>
      <HeaderAdmin items={items} itemsToDisplay={2} />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6">داشبورد</h1>
          <SummaryCards />
          <RecentOrders />
        </main>
      </div>
    </>
  );
}
