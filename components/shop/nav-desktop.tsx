"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronLeft, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@/types/categories-types";
import { Button } from "../ui/button";

interface CategoryNavigationProps {
  categories: Category[];
  className?: string;
}

export default function DesktopCategoryNavigation({
  categories,
  className,
}: CategoryNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleCategory = (categoryId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const renderCategory = (category: Category, level = 0) => {
    const isExpanded = expandedCategories.includes(category.id);
    const hasChildren = category.children && category.children.length > 0;

    return (
      <li key={category.id} className="relative">
        <div className={cn("flex items-center justify-between gap-4")}>
          <Link
            href={category.href || "#"}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "font-medium text-sm flex items-center gap-3 flex-1 py-2 px-4 rounded-md transition-colors",
              level === 0
                ? "text-foreground hover:bg-primary/10"
                : "text-muted-foreground hover:bg-primary/5",
              isExpanded && "bg-primary/10",
            )}
          >
            <div className="relative w-6 h-6 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
            <p>{category.name}</p>
          </Link>
          {hasChildren && (
            <button
              onClick={(e) => toggleCategory(category.id, e)}
              className="rounded-full bg-primary/10 transition-colors p-2"
              aria-label={isExpanded ? "Collapse category" : "Expand category"}
            >
              {isExpanded ? (
                <ChevronDown className="h-6 w-6 text-muted-foreground" />
              ) : (
                <ChevronLeft className="h-6 w-6 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <ul className={cn("pr-4 space-y-1 mt-1 border-r border-border mr-4")}>
            {category.children!.map((child) =>
              renderCategory(child, level + 1),
            )}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div
      ref={menuRef}
      className={cn("relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button variant="outline" onClick={toggleMenu}>
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        <span>دسته‌ها</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
        />
      </Button>

      {isOpen && (
        <div className="absolute z-50 top-full right-0 mt-2 w-[600px] lg:w-[800px] bg-background rounded-lg shadow-lg border border-border overflow-hidden">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">مرور دسته‌ها</h3>
            <ul className="space-y-2">
              {categories.map((category) => renderCategory(category))}
            </ul>
          </div>
          <div className="bg-muted/50 p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Explore our wide range of categories to find exactly what you are
              looking for.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
