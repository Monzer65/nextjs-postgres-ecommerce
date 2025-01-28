"use client";

import { useState } from "react";
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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

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

  const sortedCategories = [...categories].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue === null || bValue === null) {
      return 0;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: keyof Category) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="[&>*]:text-right">
          <TableHead className="w-[100px]" onClick={() => handleSort("id")}>
            آیدی
          </TableHead>
          <TableHead onClick={() => handleSort("name")}>نام</TableHead>
          <TableHead>توضیحات</TableHead>
          <TableHead onClick={() => handleSort("parent_id")}>
            آیدی مادر
          </TableHead>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                  <DropdownMenuItem className="p-0">
                    <Link
                      href={`/admin/dashboard/products/categories/edit/${category.id}`}
                      className="w-full flex items-center gap-2 p-2"
                    >
                      <Pencil className="h-4 w-4" />
                      ویرایش
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="h-4 w-4" />
                    حذف{" "}
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
