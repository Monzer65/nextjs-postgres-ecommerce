"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MenuIcon,
  ChevronRight,
  ChevronsUpDown,
  ChevronLeft,
} from "lucide-react";
import { Category } from "./SiteHeader";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { Separator } from "./ui/separator";
import { useState } from "react";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [isOpenCollapsible, setIsOpenCollapsible] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">دکمه منو</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            <Link href="/">منو</Link>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <nav className="space-y-2">
            <Separator />
            {activeCategory ? (
              <>
                <button
                  className="w-full flex justify-start items-center hover:bg-accent py-2"
                  onClick={() => setActiveCategory(null)}
                >
                  <ChevronRight className="h-4 w-4" />
                  بازگشت
                </button>
                <Separator />
                <div className="text-lg font-semibold pr-2">
                  {activeCategory.title}
                </div>
                {activeCategory.children?.map((child, index) => (
                  <Link
                    key={index}
                    href={child.href}
                    className="block py-2 pr-4 hover:bg-accent"
                  >
                    {child.title}
                  </Link>
                ))}
                <Separator />
              </>
            ) : (
              <>
                <div className="mt-4 space-y-2">
                  <Collapsible
                    open={isOpenCollapsible}
                    onOpenChange={setIsOpenCollapsible}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="w-full flex justify-between hover:bg-accent p-2 font-bold">
                        دسته‌بندی‌ها
                        <ChevronsUpDown className="w-4" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mx-4">
                      {categories.map((category, index) => (
                        <button
                          key={index}
                          className="w-full flex justify-between items-center hover:bg-accent p-2"
                          onClick={() => setActiveCategory(category)}
                        >
                          {category.title}
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                  <Separator />
                  <Link
                    href="/about"
                    className="block p-2 hover:bg-accent font-bold"
                  >
                    درباره ما
                  </Link>
                  <Separator />
                  <Link
                    href="/contact"
                    className="block p-2 hover:bg-accent font-bold"
                  >
                    تماس با ما
                  </Link>
                  <Separator />
                </div>
              </>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
