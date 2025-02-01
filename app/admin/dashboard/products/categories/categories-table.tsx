"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { DeleteCategory } from "./edit/[id]/delete-form";

interface Category {
  id: number;
  name: string;
  description: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

interface CategoriesTableProps {
  categories: Category[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof Category>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return sortDirection === "asc" ? 1 : -1;
      if (bValue === null) return sortDirection === "asc" ? -1 : 1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [categories, sortColumn, sortDirection]);

  const handleSort = (column: keyof Category) => {
    setSortDirection(
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc",
    );
    setSortColumn(column);
  };

  const SortableHeader = ({
    column,
    children,
  }: {
    column: keyof Category;
    children: React.ReactNode;
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => handleSort(column)}
      aria-sort={
        sortColumn === column
          ? sortDirection === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <div className="flex items-center justify-start gap-2">
        {children}
        <ArrowUpDown className="h-4 w-4" />
      </div>
    </TableHead>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHeader column="id">آیدی</SortableHeader>
          <SortableHeader column="name">نام</SortableHeader>
          <TableHead className="text-right">توضیحات</TableHead>
          <SortableHeader column="parent_id">آیدی مادر</SortableHeader>
          <TableHead>تغییر/حذف</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedCategories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium border">{category.id}</TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category.description}</TableCell>
            <TableCell>{category.parent_id ?? "N/A"}</TableCell>
            <TableCell>
              <DropdownMenu
                open={openDropdownId === category.id}
                onOpenChange={(isOpen) =>
                  setOpenDropdownId(isOpen ? category.id : null)
                }
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                  <DropdownMenuItem className="p-0" asChild>
                    <Link
                      href={`/admin/dashboard/products/categories/edit/${category.id}`}
                      className="w-full flex items-center gap-2 p-2"
                    >
                      <Pencil className="h-4 w-4" />
                      ویرایش
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-0" asChild>
                    <DeleteCategory id={category.id.toString()} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
