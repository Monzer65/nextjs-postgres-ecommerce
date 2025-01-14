"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { User, Package, MapPin, Heart, Settings } from "lucide-react";
import { LogoutButton } from "./logout-button";

const links = [
  { href: "/account", label: "داشبورد", icon: User },
  { href: "/account/orders", label: "سفارشات", icon: Package },
  { href: "/account/addresses", label: "آدرس‌ها", icon: MapPin },
  { href: "/account/wishlist", label: "لیست علاقمندی‌ها", icon: Heart },
  { href: "/account/profile", label: "تنظیمات", icon: Settings },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-md border-t z-50">
        <div className="flex justify-between px-4 py-2">
          {links.map((link) => {
            const LinkIcon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <LinkIcon className="w-6 h-6" />
                <span className="text-xs mt-1">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">منوی حساب کاربری</h2>
        <NavLinks />
        <LogoutButton
          className="mt-2"
          buttonClassName="flex items-center w-full justify-start py-2 px-4 text-red-600 hover:bg-gray-100 rounded-lg"
          iconClassName="w-5 h-5 mr-3"
        />
      </aside>
    </>
  );
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-2">
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Button
            asChild
            key={link.href}
            variant={isActive ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              isActive ? "bg-gray-100 text-gray-900" : "text-gray-600"
            }`}
            onClick={onClick}
          >
            <Link href={link.href}>
              <LinkIcon className="w-5 h-5 mr-3" />
              <span>{link.label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
