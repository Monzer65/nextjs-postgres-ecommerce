"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

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
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex gap-px">
        {allPages.map((page, index) => {
          let position: "first" | "last" | "single" | "middle" | undefined;

          if (index === 0) position = "first";
          if (index === allPages.length - 1) position = "last";
          if (allPages.length === 1) position = "single";
          if (page === "...") position = "middle";

          return (
            <PaginationNumber
              key={`${page}-${index}`}
              href={createPageURL(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
            />
          );
        })}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: "first" | "last" | "middle" | "single";
  isActive: boolean;
}) {
  const className = clsx(
    "flex h-10 w-10 items-center justify-center text-sm border transition-all",
    {
      "rounded-lg": position === "single",
      "rounded-l-lg": position === "first",
      "rounded-r-lg": position === "last",
      "z-10 bg-blue-600 border-blue-600 text-white shadow-sm": isActive,
      "hover:bg-blue-50/80 hover:text-blue-600":
        !isActive && position !== "middle",
      "text-gray-400 hover:bg-transparent cursor-default":
        position === "middle",
      "font-semibold": isActive,
      "border-gray-200": !isActive,
    },
  );

  return isActive || position === "middle" ? (
    <div className={className} {...(isActive && { "aria-current": "page" })}>
      {page}
      {position === "middle" && <span className="sr-only">More pages</span>}
    </div>
  ) : (
    <Link href={href} className={className} aria-label={`Go to page ${page}`}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const icon =
    direction === "left" ? (
      <ArrowRightIcon className="w-4 h-4" />
    ) : (
      <ArrowLeftIcon className="w-4 h-4" />
    );

  const className = clsx(
    "flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 transition-colors",
    {
      "text-gray-300 bg-gray-50 cursor-not-allowed": isDisabled,
      "hover:bg-blue-50/80 hover:text-blue-600 hover:border-blue-200":
        !isDisabled,
      "shadow-sm": !isDisabled,
    },
  );

  return isDisabled ? (
    <div
      className={className}
      aria-disabled="true"
      aria-label={`${direction} arrow disabled`}
    >
      {icon}
    </div>
  ) : (
    <Link
      className={className}
      href={href}
      aria-label={`Go to ${direction} page`}
    >
      {icon}
    </Link>
  );
}
