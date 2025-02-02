"use client";

import React, { useState } from "react";
import { ChevronDown, TypeIcon as type, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: SidebarItem[];
}

export function NavMain({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (itemTitle: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }));
  };

  const renderMenuItems = (menuItems: SidebarItem[], depth = 0) => {
    return menuItems.map((item) => {
      const isParentActive = item.items?.some((subItem) =>
        pathname.startsWith(subItem.url),
      );
      const isOpen = openItems[item.title] ?? (item.isActive || isParentActive);

      return (
        <Collapsible
          key={item.title}
          asChild
          open={isOpen}
          onOpenChange={() => toggleItem(item.title)}
          className="group/collapsible"
        >
          <SidebarMenuItem
            className={cn("flex flex-col", depth > 0 && `pr-${depth * 1} mr-1`)}
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={item.title}
                size={"lg"}
                className={cn(
                  "flex w-full items-center justify-between p-0 rounded-lg transition-all",
                  "text-gray-700 dark:text-gray-200",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  {
                    "bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200":
                      pathname === item.url || isParentActive,
                    "hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900 dark:hover:text-indigo-200":
                      !(pathname === item.url || isParentActive),
                  },
                )}
              >
                <Link
                  href={item.url}
                  className="flex items-center gap-3 w-full"
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span className="font-medium text-sm text-right">
                    {item.title}
                  </span>
                </Link>
                {item.items && item.items.length > 0 && (
                  <ChevronDown
                    className={cn(
                      "ml-2 transition-transform duration-200 w-full",
                      isOpen ? "rotate-180" : "rotate-0",
                    )}
                  />
                )}
              </SidebarMenuButton>
            </CollapsibleTrigger>

            {item.items && item.items.length > 0 && (
              <CollapsibleContent>
                <SidebarMenuSub className="pr-2 border-l border-gray-200 dark:border-gray-700">
                  {renderMenuItems(item.items, depth + 1)}
                </SidebarMenuSub>
              </CollapsibleContent>
            )}
          </SidebarMenuItem>
        </Collapsible>
      );
    });
  };

  return (
    <SidebarGroup className="w-full">
      <SidebarGroupLabel className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-3 py-2">
        منوی اصلی
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1">{renderMenuItems(items)}</SidebarMenu>
    </SidebarGroup>
  );
}
