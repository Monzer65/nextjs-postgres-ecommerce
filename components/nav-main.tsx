"use client";

import { ChevronLeft, type LucideIcon } from "lucide-react";
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
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>منوی اصلی</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isParentActive = item.items?.some((subItem) =>
            pathname.startsWith(subItem.url)
          );

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive || isParentActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} size={"lg"}>
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center justify-center gap-2 p-1",
                        {
                          "bg-blue-500 text-white":
                            pathname === item.url || isParentActive,
                        }
                      )}
                    >
                      {item.icon && <item.icon />}
                      <span className="font-semibold">{item.title}</span>
                    </Link>
                    {item.items && (
                      <ChevronLeft className="mr-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            href={subItem.url}
                            className={cn("flex items-center gap-2 p-1", {
                              "bg-blue-500 text-white": pathname.startsWith(
                                subItem.url
                              ),
                            })}
                          >
                            <span>{subItem.icon && <subItem.icon />}</span>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
