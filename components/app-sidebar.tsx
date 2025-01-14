"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  CircleCheckBig,
  CircleOff,
  ClockArrowUp,
  FileStack,
  Home,
  Plus,
  SquareTerminal,
  Tag,
  Users2,
  WatchIcon,
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
    name: "admin",
    email: "danesh.monzer@gmail.com",
    avatar: "/file.svg",
    role: "Admin",
  },
  navMain: [
    {
      title: "داشبورد",
      url: "/admin/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "مشتریان",
      url: "/admin/dashboard/customers",
      icon: Users2,
      items: [
        {
          title: "افزودن مشتری",
          url: "/admin/dashboard/customers/add",
          icon: Plus,
        },
      ],
    },
    {
      title: "محصولات",
      url: "/admin/dashboard/products",
      icon: Bot,
      items: [
        {
          title: "افزودن محصول",
          url: "/admin/dashboard/products/add",
          icon: Plus,
        },
        {
          title: "دسته‌بندی‌ها",
          url: "/admin/dashboard/products/categories",
          icon: FileStack,
        },
        {
          title: "تگ‌ها",
          url: "/admin/dashboard/products/tags",
          icon: Tag,
        },
      ],
    },
    {
      title: "سفارشات",
      url: "/admin/dashboard/orders",
      icon: BookOpen,
      items: [
        {
          title: "افزودن سفارش",
          url: "/admin/dashboard/orders/add",
          icon: Plus,
        },
        {
          title: "سفارشات در انتظار",
          url: "/admin/dashboard/orders/pending",
          icon: ClockArrowUp,
        },
        {
          title: "سفارشات پایان‌یافته",
          url: "/admin/dashboard/orders/completed",
          icon: CircleCheckBig,
        },
        {
          title: "سفارشات لغو شده",
          url: "/admin/dashboard/orders/cancelled",
          icon: CircleOff,
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
      <SidebarHeader>
        <Link
          href="/admin"
          className="bg-sidebar-accent text-sidebar-accent-foreground p-2"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Home className="size-4" />
          </div>
        </Link>
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
