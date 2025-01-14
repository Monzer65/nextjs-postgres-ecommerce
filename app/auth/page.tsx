import { globalGETRateLimit } from "@/lib/auth/request";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import LoginSignupForm from "./auth-form";

export default async function AuthPage() {
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }

  const { session, user } = await getCurrentSession();

  if (session !== null) {
    // User is logged in but phone and OTP are not verified
    if (user?.phone_verified === false || user?.otp_verified === false) {
      return redirect("/auth/verify");
    }
    // User is logged in and both phone and OTP are verified, go to home
    return redirect("/");
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 justify-center items-center">
        <Image
          src="/vintage.svg"
          alt="Auth illustration"
          width={600}
          height={600}
          className="object-cover"
        />
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                ورود | ثبت‌نام
              </CardTitle>
            </div>
            <CardDescription>ورود و یا ایجاد حساب کاربری جدید</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginSignupForm />
          </CardContent>
          <CardFooter className="flex flex-col gap-2 justify-center">
            <p className="text-sm text-muted-foreground">
              با ورود یا ثبت نام، شما با
              <Link
                href="/terms"
                className="mx-1 underline text-blue-600 underline-offset-4"
              >
                شرایط استفاده
              </Link>
              و
              <Link
                href="/privacy"
                className="mx-1 underline text-blue-600 underline-offset-4"
              >
                سیاست حفظ حریم خصوصی
              </Link>
              ما موافقت می‌کنید.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
