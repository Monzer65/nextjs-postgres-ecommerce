import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { globalGETRateLimit } from "@/lib/auth/request";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function Wishlist() {
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

  const wishlistItems = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: "$129.99",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: "$199.99",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Portable Charger",
      price: "$49.99",
      image: "/placeholder.svg?height=100&width=100",
    },
  ];

  return (
    <div className="space-y-6 mb-12">
      <h2 className="text-2xl font-bold">لیست علاقمندی‌های من</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wishlistItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                />
              </div>
              <p className="mt-2 text-center font-bold">{item.price}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">حذف</Button>
              <Button>افزودن به سبد خرید</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {wishlistItems.length === 0 && (
        <p className="text-center text-muted-foreground">
          لیست علاقمندی‌های شما خالی است.
        </p>
      )}
    </div>
  );
}
