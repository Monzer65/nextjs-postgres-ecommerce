"use client";

import type React from "react";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="mx-auto flex justify-center">
      <ul className="flex items-center gap-1">
        <PaginationArrow
          direction="prev"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        {allPages.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
                page={page}
              />
            )}
          </PaginationItem>
        ))}

        <PaginationArrow
          direction="next"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </ul>
    </nav>
  );
}

function PaginationItem({ children }: { children: React.ReactNode }) {
  return <li className="flex items-center">{children}</li>;
}

function PaginationLink({
  page,
  href,
  isActive,
}: {
  page: number | string;
  href: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-background hover:bg-accent hover:text-accent-foreground",
      )}
      aria-label={`Go to page ${page}`}
    >
      {page}
    </Link>
  );
}

function PaginationEllipsis() {
  return (
    <div className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">
      <span className="sr-only">More pages</span>
      <span aria-hidden="true">...</span>
    </div>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "prev" | "next";
  isDisabled?: boolean;
}) {
  const Icon = direction === "prev" ? ChevronRight : ChevronLeft;
  const ariaLabel = `Go to ${direction === "prev" ? "previous" : "next"} page`;

  if (isDisabled) {
    return (
      <li>
        <span
          className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-md bg-muted text-muted-foreground opacity-50"
          aria-disabled="true"
        >
          <span className="sr-only">{ariaLabel}</span>
          <Icon className="h-4 w-4" />
        </span>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        className="flex h-9 w-9 items-center justify-center rounded-md bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label={ariaLabel}
      >
        <Icon className="h-4 w-4" />
      </Link>
    </li>
  );
}
