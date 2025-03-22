import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MobileNav } from "./nav-mobile";
import UserAccountDropdown from "./nav-user";
import { SearchButton } from "@/components/search-button";
import { getCurrentSession } from "@/lib/auth/session";
import { getCachedCategories } from "@/lib/shop/data";
import DesktopCategoryNavigation from "./nav-desktop";
import { AnimatedText } from "./animated-text";

export async function Header() {
  const { session, user, roles } = await getCurrentSession();
  const categories = await getCachedCategories();

  return (
    <>
      {/* Top Bar */}
      <div className="hidden border-b py-2 px-4 sm:block">
        <div className="flex items-center justify-between">
          <AnimatedText className="text-sm">
            ارسال رایگان برای خرید بالای ۱۵۰ هزار تومان
          </AnimatedText>
          <div className="flex items-center gap-4">
            <Link href="/track-order" className="text-sm hover:underline">
              پیگیری سفارش{" "}
            </Link>
            <Link href="/contact" className="text-sm hover:underline">
              تماس با ما{" "}
            </Link>
            <Link href="/about" className="text-sm hover:underline">
              درباره ما{" "}
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 md:p-4">
        <div className="flex h-14 items-center">
          <div className="flex justify-between items-center gap-2">
            <div className="font-bold text-xl">شاپزی</div>
            <DesktopCategoryNavigation
              categories={categories}
              className="hidden md:block"
            />
          </div>

          <MobileNav
            categories={categories}
            session={session || null}
            user={user ?? null}
          />
          <div className="flex flex-1 items-center space-x-2 rtl:space-x-reverse md:justify-end mr-4">
            <SearchButton />
            <nav className="flex items-center space-x-2 rtl:space-x-reverse">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    title="سبد خرید"
                    size="icon"
                    className="relative"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="sr-only">Shopping cart</span>
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                      0
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href="/cart">سبد خرید</Link>
                    </SheetTitle>
                  </SheetHeader>
                  {/* Add cart items here */}
                  <div className="flex flex-col space-y-4 my-8">
                    <p>سبد خرید شما خالی است.</p>
                    <Button>تکمیل خرید</Button>
                  </div>
                </SheetContent>
              </Sheet>
              <UserAccountDropdown
                session={session || null}
                user={user ?? null}
                roles={roles ?? []}
              />
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
