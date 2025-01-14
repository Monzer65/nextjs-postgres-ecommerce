import { globalGETRateLimit } from "@/lib/auth/request";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import VerifyPhoneForm from "./verify-form";

export default async function VerifyPage() {
  if (!globalGETRateLimit()) {
    return "Too many requests";
  }

  const { session, user } = await getCurrentSession();

  if (session === null) {
    return redirect("/auth");
  }

  // If phone or OTP are not verified, allow them to proceed with verification
  if (user?.phone_verified === false || user?.otp_verified === false) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 justify-center items-center">
          <Image
            src="/vintage.svg"
            alt="Verify phone illustration"
            width={600}
            height={600}
            className="object-cover"
          />
        </div>
        {/* Right side - Verify phone form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <Card className="w-full max-w-md mx-auto shadow-lg relative">
            <Link href="/auth" className="absolute left-8 top-8">
              <ArrowLeft className="w-8 h-8" />
            </Link>
            <CardHeader className="space-y-1">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">
                  تایید شماره تلفن
                </CardTitle>
              </div>
              <CardDescription>
                برای ادامه، لطفاً شماره تلفن خود را تایید کنید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VerifyPhoneForm />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If phone and OTP are already verified, redirect to homepage
  return redirect("/");
}
