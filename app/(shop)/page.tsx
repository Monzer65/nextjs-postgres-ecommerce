//// import { db } from "@/db/db";
//
//export default async function Home() {
//  // const data = await db.selectFrom("user").selectAll().execute();
//
//  // if (!data) {
//  //   return <div>No data</div>;
//  // }
//
//  // console.log("db", data);
//  return <div className="grid place-items-center min-h-screen">فروشگاه</div>;
//}

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  Star,
  Truck,
  RefreshCw,
  Shield,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/25 z-10" />
        <div className="relative h-[500px] w-full">
          <Image
            src="/hero.jpg?height=1080&width=1920"
            alt="Elegant living room with curtains"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="px-4 sm:px-8 absolute inset-0 z-20 flex flex-col items-start justify-center text-white">
          <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            یک تغییر اساسی برای خونه تو
          </h1>
          <p className="mt-4 max-w-md text-base sm:text-lg md:text-xl">
            پرده های باکیفیت برتر را پیدا کنید تا دکوراسیون خانه شما را با سبک و
            پیچیدگی مدنظر خود ارتقاء دهید.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              variant={"outline"}
              className="text-black bg-white/90 hover:bg-white/10 hover:text-white hover:border-white"
            >
              الان خرید کن{" "}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-white/10 hover:bg-white/90 hover:text-black"
            >
              دیدن مجموعه‌ها{" "}
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="px-4 sm:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-center mb-8">
            خرید بر اساس دسته
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href="#"
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-square w-full overflow-hidden rounded-lg">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black/25 flex items-end p-4">
                  <h3 className="text-xl font-medium text-white">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-muted/50">
        <div className="px-4 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Bestsellers
            </h2>
            <Link
              href="#"
              className="flex items-center text-sm font-medium hover:underline"
            >
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-lg bg-background"
              >
                <div className="aspect-square w-full overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < product.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                          />
                        ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">Add to wishlist</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {benefit.icon}
                </div>
                <h3 className="mt-4 text-lg font-medium">{benefit.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 lg:py-20 bg-muted/50">
        <div className="px-4 sm:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-lg bg-background p-6 shadow-sm"
              >
                <div className="flex">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-primary text-primary"
                      />
                    ))}
                </div>
                <p className="mt-4 text-muted-foreground">
                  "{testimonial.content}"
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt={testimonial.name}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="px-4 sm:px-8">
          <div className="rounded-lg bg-primary/5 p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Join Our Newsletter
              </h2>
              <p className="mt-4 text-muted-foreground">
                Subscribe to get special offers, free giveaways, and
                once-in-a-lifetime deals.
              </p>
              <form className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="sm:flex-1"
                  required
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Sample data
const categories = [
  {
    name: "Blackout Curtains",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Sheer Curtains",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Valances",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Curtain Rods",
    image: "/placeholder.svg?height=400&width=400",
  },
];

const products = [
  {
    id: 1,
    name: "Luxe Velvet Blackout Curtains",
    price: 89.99,
    originalPrice: 119.99,
    rating: 5,
    reviews: 124,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 2,
    name: "Linen Blend Sheer Curtains",
    price: 59.99,
    rating: 4,
    reviews: 86,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 3,
    name: "Thermal Insulated Drapes",
    price: 79.99,
    originalPrice: 99.99,
    rating: 5,
    reviews: 210,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 4,
    name: "Decorative Window Valance",
    price: 34.99,
    rating: 4,
    reviews: 42,
    image: "/placeholder.svg?height=300&width=300",
  },
];

const benefits = [
  {
    title: "Free Shipping",
    description: "On all orders over $150",
    icon: <Truck className="h-6 w-6" />,
  },
  {
    title: "Easy Returns",
    description: "30-day return policy",
    icon: <RefreshCw className="h-6 w-6" />,
  },
  {
    title: "Secure Payments",
    description: "100% secure checkout",
    icon: <Shield className="h-6 w-6" />,
  },
  {
    title: "Quality Guarantee",
    description: "Satisfaction guaranteed",
    icon: <Star className="h-6 w-6" />,
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, NY",
    content:
      "The blackout curtains are amazing! They completely transformed my bedroom and I'm sleeping better than ever.",
  },
  {
    name: "Michael Chen",
    location: "San Francisco, CA",
    content:
      "Excellent quality and the customer service was outstanding. I'll definitely be ordering more for my other rooms.",
  },
  {
    name: "Emily Rodriguez",
    location: "Chicago, IL",
    content:
      "Beautiful curtains that look much more expensive than they are. Fast shipping and easy to install.",
  },
];
