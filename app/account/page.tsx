import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { globalGETRateLimit } from "@/lib/auth/request";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function AccountOverview() {
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }

  const { session, user } = await getCurrentSession();

  if (!session) {
    // Redirect unauthenticated users to the login page
    return redirect("/auth");
  }

  if (!user?.phone_verified || !user?.otp_verified) {
    // Redirect users to the verification page if phone or OTP is not verified
    return redirect("/auth/verify");
  }

  return (
    <div className="space-y-8 mb-12">
      <h2 className="text-3xl font-bold text-gray-800">داشبورد</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              آخرین سفارشات
              <Link
                href="/account/orders"
                className={`${buttonVariants({
                  variant: "ghost",
                })}text-gray-500`}
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </CardTitle>
            <CardDescription className="text-sm">سه سفارش اخیر</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="text-gray-700">
                <strong>سفارش #12345:</strong> ارسال شده
              </li>
              <li className="text-gray-700">
                <strong>سفارش #12344:</strong> به مقصد رسیده
              </li>
              <li className="text-gray-700">
                <strong>سفارش #12343:</strong> درحال پردازش
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Primary Address */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              آدرس اصلی
              <Link
                href="/account/addresses"
                className={`${buttonVariants({
                  variant: "ghost",
                })}text-gray-500`}
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">John Doe</p>
            <p className="text-gray-600">خیابان ۱۲۳</p>
            <p className="text-gray-600">شهرک ۱۲۳</p>
            <p className="text-gray-600">شهر ایکس</p>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              جزئیات حساب
              <Link
                href="/account/profile"
                className={`${buttonVariants({
                  variant: "ghost",
                })}text-gray-500`}
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>نام:</strong> جان دو
              </p>
              <p>
                <strong>ایمیل:</strong> john.doe@example.com
              </p>
              <p>
                <strong>تاریخ عضویت:</strong> اول ژانویه ۲۰۲۳
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
