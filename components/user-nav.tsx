"use client";

import { useState } from "react";
import {
  User2,
  Settings,
  Package,
  Heart,
  ChevronDown,
  LogIn,
  UserCircle,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "./logout-button";
import { User, UserSession } from "@/db/schema";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function UserAccountDropdown({
  session,
  user,
  roles
}: {
  session: UserSession | null;
  user: User | null;
  roles: any | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const isAdmin = roles.some((role: { name: string }) => role.name.includes("Admin"));

  if (!session || !user?.phone_verified || !user?.otp_verified) {
    return (
      <Link href="/auth">
        <Button
          variant="outline"
          title="ورود | ثبت نام"
          className="flex items-center space-x-2"
        >
          <LogIn className="w-5 h-5" />
          <span className="hidden md:inline">ورود | ثبت‌نام</span>
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <User2 className="w-5 h-5" />
          {!isMobile && (
            <span className="font-medium text-sm truncate max-w-[100px]">
              <span className="text-xs text-muted-foreground">
                {user?.first_name && user?.last_name ? (
                  `${user.first_name} ${user.last_name}`
                ) : (
                  <span dir="ltr">{user.phone}</span>
                )}
              </span>
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""
              }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/account" className="flex items-center">
            <User2 className="w-4 h-4 mr-2" />
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                حساب کاربری
                <span className="text-xs text-muted-foreground">
                  {user?.first_name && user?.last_name ? (
                    `${user.first_name} ${user.last_name}`
                  ) : (
                    <span dir="ltr">{user.phone}</span>
                  )}
                </span>
              </div>
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={user.avatar || undefined}
                  alt={user.username || "User avatar"}
                />
                <AvatarFallback>
                  <UserCircle className="w-8 h-8 text-primary" />
                </AvatarFallback>
              </Avatar>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              <span>پنل مدیریت</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/account/profile" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            <span>پروفایل</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/orders" className="flex items-center">
            <Package className="w-4 h-4 mr-2" />
            <span>سفارشات من</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/wishlist" className="flex items-center">
            <Heart className="w-4 h-4 mr-2" />
            <span>علاقمندی‌ها</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutButton
            className="p-0"
            buttonClassName="justify-start px-2 text-red-600 hover:text-red-700 hover:bg-red-100 gap-4"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
