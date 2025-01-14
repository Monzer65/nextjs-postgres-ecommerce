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

export default async function Addresses() {
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

  const addresses = [
    {
      id: 1,
      name: "John Doe",
      street: "123 Main St",
      city: "Anytown",
      state: "ST",
      zip: "12345",
      country: "United States",
      isDefault: true,
    },
    {
      id: 2,
      name: "John Doe",
      street: "456 Elm St",
      city: "Other City",
      state: "ST",
      zip: "67890",
      country: "United States",
      isDefault: false,
    },
  ];

  return (
    <div className="space-y-6 mb-12">
      <h2 className="text-2xl font-bold">My Addresses</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardHeader>
              <CardTitle>
                {address.name} {address.isDefault && "(Default)"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state} {address.zip}
              </p>
              <p>{address.country}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Edit</Button>
              {!address.isDefault && (
                <Button variant="outline">Set as Default</Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      <Button>Add New Address</Button>
    </div>
  );
}
