// products-table.tsx
import Pagination from "@/components/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProducts } from "@/lib/admin/data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { RotateCw, PackageOpen } from "lucide-react";
import { DeleteProduct } from "./delete-button";

export default async function ProductsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const data = await getProducts(query, currentPage);

  if (!data)
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <RotateCw className="h-12 w-12 text-red-500 animate-pulse" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">خطا در دریافت محصولات</h3>
          <p className="text-muted-foreground">
            لطفاً اتصال اینترنت خود را بررسی کرده و مجدداً تلاش کنید
          </p>
        </div>
      </div>
    );

  if (data.products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <PackageOpen className="h-12 w-12 text-blue-500" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">محصولی یافت نشد</h3>
          <p className="text-muted-foreground">
            برای ایجاد محصول جدید روی دکمه "افزودن محصول" کلیک کنید
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Table className="relative">
        <caption className="sr-only">لیست محصولات</caption>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[150px] text-right">تصویر</TableHead>
            <TableHead className="min-w-[200px] text-right">
              نام محصول
            </TableHead>
            <TableHead className="min-w-[120px] text-right">برند</TableHead>
            <TableHead className="min-w-[120px] text-right">قیمت</TableHead>
            <TableHead className="min-w-[100px] text-center">موجودی</TableHead>
            <TableHead className="w-[80px] text-center">عملیات</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.products.map((product, index) => (
            <TableRow
              key={index}
              className="transition-colors hover:bg-muted/30 cursor-pointer"
            >
              <TableCell className="p-2">
                <div className="relative aspect-square w-20 overflow-hidden rounded-lg border">
                  <Image
                    unoptimized
                    src={product.image_urls[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 20vw"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-sm">
                  {product.brand_name}
                </Badge>
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat("fa-IR").format(product.price)} تومان
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={product.stock > 0 ? "outline" : "destructive"}
                  className="w-20 justify-center"
                >
                  {product.stock > 0 ? "موجود" : "ناموجود"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <DeleteProduct id={product.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter className="bg-transparent">
          <TableRow>
            <TableCell colSpan={5} className="p-4">
              <div className="flex justify-center">
                <Pagination totalPages={data.totalPages} />
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
