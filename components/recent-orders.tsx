import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const recentOrders = [
  { id: "1234", customer: "John Doe", total: "$129.99", status: "اتمام" },
  {
    id: "1235",
    customer: "Jane Smith",
    total: "$79.99",
    status: "درحال پردازش",
  },
  {
    id: "1236",
    customer: "Bob Johnson",
    total: "$199.99",
    status: "ارسال شده",
  },
  { id: "1237", customer: "Alice Brown", total: "$59.99", status: "درانتظار" },
  {
    id: "1238",
    customer: "Charlie Wilson",
    total: "$149.99",
    status: "اتمام",
  },
];

export default function RecentOrders() {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">سفارشات اخیر</h2>
      <Table>
        <TableHeader>
          <TableRow className="[&>*]:text-right">
            <TableHead>شماره سفارش</TableHead>
            <TableHead>مشتری</TableHead>
            <TableHead>مجموع</TableHead>
            <TableHead>وضعیت</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>
                <Badge
                  variant={order.status === "اتمام" ? "default" : "secondary"}
                >
                  {order.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
