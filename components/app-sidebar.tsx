"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  User2,
  Users,
  Users2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
    role: "Admin",
  },
  navMain: [
    {
      title: "داشبورد",
      url: "/admin/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "گزارشات فروش",
          url: "#",
        },
        {
          title: "گزارشات مشتریان",
          url: "#",
        },
        {
          title: "گزارشات انبار",
          url: "#",
        },
      ],
    },
    {
      title: "مشتریان",
      url: "/admin/dashboard/customers",
      icon: Users2,
      items: [
        {
          title: "همه مشتریان",
          url: "#",
        },
        {
          title: "افزودن مشتری",
          url: "#",
        },
      ],
    },
    {
      title: "محصولات",
      url: "/admin/dashboard/products",
      icon: Bot,
      items: [
        {
          title: "همه محصولات",
          url: "#",
        },
        {
          title: "افزودن محصول",
          url: "#",
        },
        {
          title: "دسته‌بندی‌ها",
          url: "#",
        },
        {
          title: "تگ‌ها",
          url: "#",
        },
      ],
    },
    {
      title: "سفارشات",
      url: "/admin/dashboard/orders",
      icon: BookOpen,
      items: [
        {
          title: "همه سفارشات",
          url: "#",
        },
        {
          title: "سفارشات معلق",
          url: "#",
        },
        {
          title: "سفارشات پایان‌یافته",
          url: "#",
        },
      ],
    },
    {
      title: "تنظیمات",
      url: "/admin/dashboard/sttings",
      icon: Settings2,
      items: [
        {
          title: "تنظیمات عمومی",
          url: "#",
        },
        {
          title: "تنظیمات پرداخت",
          url: "#",
        },
        {
          title: "تنظیمات ارسال",
          url: "#",
        },
      ],
    },
  ],

  metrics: {
    totalSales: "$10,000",
    totalOrders: 250,
    totalCustomers: 180,
    activeShops: 2,
  },
  recentActivities: [
    {
      activity: "Order #1234 placed by John Doe",
      timestamp: "2025-01-06 12:34:56",
    },
    {
      activity: "Product 'Smartphone' added",
      timestamp: "2025-01-06 11:22:33",
    },
    {
      activity: "Customer 'Jane Doe' registered",
      timestamp: "2025-01-06 10:45:12",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} side="right">
      <SidebarHeader className="p-0">
        <Link
          href="/admin"
          className="bg-sidebar-accent text-sidebar-accent-foreground p-2"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Home className="size-4" />
          </div>
        </Link>
        {/* <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">Acme</span>
          <span className="truncate text-xs">ecom</span>
        </div> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
