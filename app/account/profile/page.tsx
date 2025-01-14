import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { globalGETRateLimit } from "@/lib/auth/request";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function ProfileSettings() {
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
    <div className="space-y-6 mb-12">
      <h2 className="text-2xl font-bold">تنظیمات پروفایل</h2>
      <form className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">نام</Label>
          <Input id="name" defaultValue="John Doe" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">ایمیل</Label>
          <Input id="email" type="email" defaultValue="john.doe@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">تلفن</Label>
          <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">پسورد جدید</Label>
          <Input id="password" type="password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">تکرار پسورد جدید</Label>
          <Input id="confirmPassword" type="password" />
        </div>
        <Button type="submit">ذخیره تفییرات</Button>
      </form>
    </div>
  );
}
