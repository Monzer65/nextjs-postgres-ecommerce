import Link from "next/link";
import { Button } from "@/components/ui/button";
import SideNav from "@/components/account-nav";
import { Home } from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            پنل کاربری
          </h1>
          <Button asChild variant="outline" size="sm" className="sm:flex">
            <Link href="/">
              <Home className="w-5 h-5" /> خانه
            </Link>
          </Button>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <SideNav />
          <main className="flex-1 bg-white rounded-lg shadow-md p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
