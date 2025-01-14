import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Search, ShoppingCart } from "lucide-react";
import { forwardRef } from "react";
import { MobileNav } from "./mobile-nav";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import UserAccountDropdown from "./user-nav";
import { getCurrentSession } from "@/lib/auth/session";

export type Category = {
  title: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  children?: {
    title: string;
    href: string;
    description?: string;
    icon?: React.ReactNode;
    image?: string;
  }[];
};

// Example categories for curtains e-commerce
export const categories: Category[] = [
  {
    title: "پرده",
    href: "/categories/curtains",
    description: "انواع پرده‌های شیک برای تمام اتاق‌ها.",
    // icon: <Home className='h-4 w-4' />,
    image:
      "https://res.cloudinary.com/der7kb8jr/image/upload/v1733915046/cld-sample-5.jpg",
    children: [
      {
        title: "پرده هال و پذیرایی",
        href: "/categories/curtains/living-room",
        description: "پرده‌های زیبا برای فضای پذیرایی.",
      },
      {
        title: "پرده اتاق خواب",
        href: "/categories/curtains/bedroom",
        description: "پرده‌های دنج و شیک برای اتاق خواب.",
      },
      {
        title: "پرده آشپزخانه",
        href: "/categories/curtains/kitchen",
        description: "پرده‌های کاربردی برای آشپزخانه.",
      },
    ],
  },
  {
    title: "تزئینات خانه",
    href: "/categories/home-decor",
    description: "انواع وسایل تزئینی برای زیباتر کردن خانه شما.",
    // icon: <Paintbrush className='h-4 w-4' />,
    image:
      "https://res.cloudinary.com/der7kb8jr/image/upload/v1733915036/samples/food/fish-vegetables.jpg",
    children: [
      {
        title: "کوسن و روبالشتی",
        href: "/categories/home-decor/cushions",
        description: "کوسن‌ها و روبالشتی‌های هماهنگ با پرده‌های شما.",
      },
      {
        title: "فرش و قالیچه",
        href: "/categories/home-decor/rugs",
        description: "فرش‌ها و قالیچه‌های شیک برای هر اتاق.",
      },
      {
        title: "تابلو و آینه",
        href: "/categories/home-decor/wall-art",
        description: "تابلوها و آینه‌های زیبا برای دیوارها.",
      },
    ],
  },
  {
    title: "نورپردازی",
    href: "/categories/lighting",
    description: "محصولات نورپردازی برای فضای داخلی.",
    // icon: <Lightbulb className='h-4 w-4' />,
    image:
      "https://res.cloudinary.com/der7kb8jr/image/upload/v1733915034/sample.jpg",
    children: [
      {
        title: "آباژور و لامپ رومیزی",
        href: "/categories/lighting/lamps",
        description: "آباژورها و لامپ‌های شیک و کاربردی.",
      },
      {
        title: "چراغ‌های رشته‌ای",
        href: "/categories/lighting/string-lights",
        description: "چراغ‌های رشته‌ای برای فضای گرم و صمیمی.",
      },
      {
        title: "نورپردازی هوشمند",
        href: "/categories/lighting/smart-lighting",
        description: "نورپردازی هوشمند برای کنترل بهتر روشنایی.",
      },
    ],
  },
  {
    title: "محصولات کاربردی پرده",
    href: "/categories/curtain-accessories",
    description: "لوازم جانبی پرده برای نصب و نگهداری بهتر.",
    // icon: <Hammer className='h-4 w-4' />,
    image:
      "https://res.cloudinary.com/der7kb8jr/image/upload/v1733915037/samples/ecommerce/leather-bag-gray.jpg",
    children: [
      {
        title: "چوب پرده و براکت",
        href: "/categories/curtain-accessories/rods",
        description: "چوب‌ پرده‌ها و براکت‌های مقاوم و زیبا.",
      },
      {
        title: "گیره و بست پرده",
        href: "/categories/curtain-accessories/hooks",
        description: "گیره‌ها و بست‌های تزئینی برای پرده‌ها.",
      },
      {
        title: "لوازم تمیزکننده پرده",
        href: "/categories/curtain-accessories/cleaning",
        description: "ابزارها و محصولات مناسب برای تمیز کردن پرده‌ها.",
      },
    ],
  },
];

export async function Header() {
  const { session, user, roles } = await getCurrentSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 md:p-4">
      <div className=" flex h-14 items-center">
        <MainNav />
        <MobileNav categories={categories} />
        <div className="flex flex-1 items-center justify-between space-x-4 rtl:space-x-reverse md:justify-end mr-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Search className="h-4 w-4" />
                جستجو
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="sr-only">
                <DialogTitle>جستجو</DialogTitle>
                <DialogDescription>
                  جستجو برای محصولات، برندها و موارد دیگر
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-8">
                <form className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="query" className="sr-only">
                    عبارت جستجو
                  </Label>
                  <Input
                    id="query"
                    placeholder="جستجو"
                    className="col-span-3"
                  />
                  <Button type="submit">جستجو</Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>

          <nav className="flex items-center space-x-4 rtl:space-x-reverse">
            <UserAccountDropdown
              session={session || null}
              user={user ?? null}
              roles={roles ?? []}
            />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Shopping cart</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/">سبد خرید</Link>
                  </SheetTitle>
                </SheetHeader>
                {/* Add cart items here */}
                <div className="flex flex-col space-y-4 my-8">
                  <p>سبد خرید شما خالی است.</p>
                  <Button>تکمیل خرید</Button>
                </div>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  );
}

function MainNav() {
  return (
    <div className="mr-4 hidden md:flex">
      <Link
        href="/"
        className="ml-6 flex items-center space-x-2 rtl:space-x-reverse"
      >
        <span className="hidden font-bold sm:inline-block">فروشگاه من</span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/contact" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                تماس
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/about" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                درباره
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>دسته‌بندی‌ها</NavigationMenuTrigger>
            <NavigationMenuContent dir="rtl">
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                {categories.map((category) => (
                  <ListItem
                    href={category.href}
                    title={category.title}
                    icon={category.icon}
                    image={category.image}
                    key={category.title}
                  >
                    {category.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    icon?: React.ReactNode;
    image?: string;
  }
>(({ className, title, children, icon, image, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex justify-start lg:justify-center">
            {image && (
              <Image
                src={image}
                alt={title || "image"}
                width={50}
                height={50}
                className="rounded-md object-cover ml-1"
              />
            )}
            <div>
              <div className="text-sm font-medium leading-none flex gap-2 items-center">
                {icon} {title}
              </div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            </div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
