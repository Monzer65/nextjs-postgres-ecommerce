"use client";

import type React from "react";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  MenuIcon,
  ChevronRight,
  Search,
  Home,
  ShoppingBag,
  Heart,
  Package,
  LogOut,
  Phone,
  Info,
  Gift,
  Percent,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Category } from "@/types/categories-types";
import { User, UserSession } from "@/db/schema";

export function MobileNav({
  categories,
  session,
  user,
}: {
  categories: Category[];
  session: UserSession | null;
  user: User | null;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<Category | null>(
    null,
  );
  const [open, setOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setActiveCategory(null);
    setActiveSubcategory(null);
    setSearchQuery("");
  };

  const renderMainMenu = () => (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="search"
          placeholder="جستجو..."
          className="pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </form>

      {/* User info */}
      <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={user?.avatar || ""}
            alt={user?.username || "کاربر"}
          />
          <AvatarFallback>
            {user?.username?.[0] || <User2 className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          {session ? (
            <p className="text-sm font-medium">{user?.username || "کاربر"}</p>
          ) : (
            <Link
              href="/auth"
              className="text-sm font-medium hover:underline"
              onClick={handleClose}
            >
              ورود / ثبت نام
            </Link>
          )}
          <p className="text-xs text-muted-foreground">
            {session ? "خوش آمدید" : "برای تجربه بهتر وارد شوید"}
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-accent"
          onClick={handleClose}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">خانه</span>
        </Link>
        <Link
          href="/wishlist"
          className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-accent"
          onClick={handleClose}
        >
          <Heart className="h-5 w-5" />
          <span className="text-xs">علاقه‌مندی</span>
        </Link>
        <Link
          href="/orders"
          className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-accent"
          onClick={handleClose}
        >
          <Package className="h-5 w-5" />
          <span className="text-xs">سفارش‌ها</span>
        </Link>
        <Link
          href="/cart"
          className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-accent relative"
          onClick={handleClose}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-xs">سبد خرید</span>
          <Badge className="absolute top-0 right-4 h-5 w-5 p-0 flex items-center justify-center">
            0
          </Badge>
        </Link>
      </div>

      <Separator />

      {/* Categories with dropdown */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium mb-2">دسته‌بندی‌ها</h3>
        {categories.map((category) => (
          <div key={category.id} className="mb-2">
            <button
              className="w-full flex items-center justify-between p-2 rounded-md hover:bg-accent text-right"
              onClick={() =>
                setActiveCategory(
                  activeCategory?.id === category.id ? null : category,
                )
              }
            >
              <div className="flex items-center gap-2">
                {category.image && (
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-md object-cover"
                  />
                )}
                <span className="text-sm">{category.name}</span>
              </div>
              <ChevronRight
                className={`h-4 w-4 transition-transform duration-200 ${
                  activeCategory?.id === category.id
                    ? "rotate-90"
                    : "rotate-180"
                }`}
              />
            </button>

            {/* Dropdown content */}
            {activeCategory?.id === category.id && category.children && (
              <div className="mr-4 mt-1 border-r pr-2 border-border">
                {category.children.map((subCategory) => (
                  <div key={subCategory.id} className="mb-1">
                    <button
                      className="w-full flex items-center justify-between p-2 rounded-md hover:bg-accent"
                      onClick={() =>
                        setActiveSubcategory(
                          activeSubcategory?.id === subCategory.id
                            ? null
                            : subCategory,
                        )
                      }
                    >
                      <span className="text-sm font-medium">
                        {subCategory.name}
                      </span>
                      {subCategory.children &&
                        subCategory.children.length > 0 && (
                          <ChevronRight
                            className={`h-3.5 w-3.5 transition-transform duration-200 ${
                              activeSubcategory?.id === subCategory.id
                                ? "rotate-90"
                                : "rotate-180"
                            }`}
                          />
                        )}
                    </button>

                    {/* Nested subcategories */}
                    {activeSubcategory?.id === subCategory.id &&
                      subCategory.children && (
                        <div className="mr-4 mt-1 border-r pr-2 border-border">
                          {subCategory.children.map((item) => (
                            <Link
                              key={item.id}
                              href={item.href || "#"}
                              className="block p-2 text-sm rounded-md hover:bg-accent"
                              onClick={handleClose}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                  </div>
                ))}

                <Link
                  href={category.href || "#"}
                  className="block w-full p-2 text-sm text-primary hover:underline"
                  onClick={handleClose}
                >
                  مشاهده همه {category.name}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      <Separator />

      {/* Special sections */}
      <div className="space-y-1">
        <Link
          href="/new-arrivals"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
          onClick={handleClose}
        >
          <Gift className="h-4 w-4" />
          <span className="text-sm">محصولات جدید</span>
        </Link>
        <Link
          href="/offers"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
          onClick={handleClose}
        >
          <Percent className="h-4 w-4" />
          <span className="text-sm">تخفیف‌ها و پیشنهادها</span>
        </Link>
      </div>

      <Separator />

      {/* Info links */}
      <div className="space-y-1">
        <Link
          href="/about"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
          onClick={handleClose}
        >
          <Info className="h-4 w-4" />
          <span className="text-sm">درباره ما</span>
        </Link>
        <Link
          href="/contact"
          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
          onClick={handleClose}
        >
          <Phone className="h-4 w-4" />
          <span className="text-sm">تماس با ما</span>
        </Link>
      </div>

      {/* Account actions */}
      {session && (
        <>
          <Separator />
          <Link
            href="/logout"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-accent text-destructive"
            onClick={handleClose}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">خروج از حساب</span>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">منو</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto"
        dir="rtl"
      >
        <SheetHeader className="text-left">
          <SheetTitle>
            <Link href="/" onClick={handleClose}>
              شاپزی
            </Link>
          </SheetTitle>
          {/*<SheetClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
              <span className="sr-only">بستن</span>
            </Button>
          </SheetClose>*/}
        </SheetHeader>

        <div className="mt-6">{renderMainMenu()}</div>
      </SheetContent>
    </Sheet>
  );
}
