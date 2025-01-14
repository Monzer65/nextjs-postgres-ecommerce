import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { globalGETRateLimit } from "@/lib/auth/request";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function Orders() {
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }

  const { session, user } = await getCurrentSession();

  if (!session) {
    // Redirect unauthenticated users to the login page
    return redirect("/auth");
  }

  if (!user?.phone_verified || !user?.otp_verified) {
    // Redirect users to the verification page if phone or OTP is not verified
    return redirect("/auth/verify");
  }

  const orders = [
    { id: "12345", date: "2023-05-01", total: "$129.99", status: "Delivered" },
    { id: "12344", date: "2023-04-15", total: "$79.99", status: "Shipped" },
    { id: "12343", date: "2023-03-30", total: "$199.99", status: "Processing" },
  ];

  return (
    <div className="space-y-6 mb-12">
      <h2 className="text-2xl font-bold">سفارشات من</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  جزئیات
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
