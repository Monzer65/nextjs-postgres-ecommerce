import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getProducts } from "@/lib/admin/data";
import Image from "next/image";

export default async function ProductsTable({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {
    const data = await getProducts(query, currentPage);
    console.log("data", data);
    if (!data)
        return <div className="text-center text-2xl">خطا در دریافت محصولات</div>;

    if (data.products.length == 0) {
        return <div className="text-center text-2xl">محصولی یافت نشد</div>;
    }

    return (
        <Table>
            <TableCaption>لیست کامل محصولات</TableCaption>
            <TableHeader>
                <TableRow className="[&>*]:text-right">
                    <TableHead className="max-w-[150px]">تصویر</TableHead>
                    <TableHead>نام محصول</TableHead>
                    <TableHead>برند</TableHead>
                    <TableHead>قیمت</TableHead>
                    <TableHead>موجودی</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.products.map((product, index) => (
                    <TableRow key={index}>
                        <TableCell className="w-[100px]">
                            <Image
                                unoptimized
                                src={product.image_urls[0]}
                                alt="Uploaded Image"
                                width={150}
                                height={150}
                                className="rounded-md object-cover w-full h-full"
                            />
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.brand_name}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell className="text-right">{product.stock}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell>مجموع</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
