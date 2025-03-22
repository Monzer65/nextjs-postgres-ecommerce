"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, Heart, User, Menu, Star, Filter, ChevronDown, X, Grid2X2, Grid3X3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

export default function ShopPage() {
  const [gridView, setGridView] = useState<"grid" | "compact">("grid")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter))
    } else {
      setActiveFilters([...activeFilters, filter])
    }
  }

  const clearAllFilters = () => {
    setActiveFilters([])
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Bar */}
      <div className="hidden border-b py-2 sm:block">
        <div className="container flex items-center justify-between">
          <p className="text-sm">Free shipping on orders over $150</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm hover:underline">
              Track Order
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center md:gap-10">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold">ElegantDrapes</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/shop" className="text-sm font-medium text-primary hover:underline">
                Shop
              </Link>
              <Link href="#" className="text-sm font-medium hover:underline">
                Collections
              </Link>
              <Link href="#" className="text-sm font-medium hover:underline">
                Custom
              </Link>
              <Link href="#" className="text-sm font-medium hover:underline">
                Sale
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <form className="hidden lg:flex items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[300px]"
                />
              </div>
            </form>
            <Button variant="ghost" size="icon" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
            <Button variant="ghost" size="icon" aria-label="Account">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">Shop</span>
          </div>
        </div>

        {/* Shop Header */}
        <div className="bg-muted/50 py-8">
          <div className="container">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Shop All Curtains</h1>
            <p className="mt-4 text-muted-foreground">
              Browse our collection of premium quality curtains for every room in your home.
            </p>
          </div>
        </div>

        {/* Shop Content */}
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium">Filters</h2>
                  {activeFilters.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 text-xs">
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Active Filters:</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeFilters.map((filter) => (
                        <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                          {filter}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFilter(filter)}
                            className="h-4 w-4 p-0 hover:bg-transparent"
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {filter} filter</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filter Sections */}
                <Accordion type="multiple" defaultValue={["category", "price", "color", "material"]}>
                  <AccordionItem value="category">
                    <AccordionTrigger className="text-sm font-medium">Category</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={activeFilters.includes(category)}
                              onCheckedChange={() => toggleFilter(category)}
                            />
                            <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="price">
                    <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="pt-4">
                          <Slider defaultValue={[0, 200]} max={500} step={10} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="w-20">
                            <Input type="number" placeholder="Min" className="h-8" />
                          </div>
                          <span className="text-muted-foreground">to</span>
                          <div className="w-20">
                            <Input type="number" placeholder="Max" className="h-8" />
                          </div>
                        </div>
                        <Button size="sm" className="w-full">
                          Apply
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="color">
                    <AccordionTrigger className="text-sm font-medium">Color</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-4 gap-2">
                        {colors.map((color) => (
                          <div
                            key={color.name}
                            className={`flex flex-col items-center gap-1 cursor-pointer ${activeFilters.includes(color.name) ? "opacity-100" : "opacity-70"}`}
                            onClick={() => toggleFilter(color.name)}
                          >
                            <div
                              className={`h-8 w-8 rounded-full border ${activeFilters.includes(color.name) ? "ring-2 ring-primary ring-offset-2" : ""}`}
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-xs">{color.name}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="material">
                    <AccordionTrigger className="text-sm font-medium">Material</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {materials.map((material) => (
                          <div key={material} className="flex items-center space-x-2">
                            <Checkbox
                              id={`material-${material}`}
                              checked={activeFilters.includes(material)}
                              onCheckedChange={() => toggleFilter(material)}
                            />
                            <Label htmlFor={`material-${material}`} className="text-sm cursor-pointer">
                              {material}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="room">
                    <AccordionTrigger className="text-sm font-medium">Room Type</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {rooms.map((room) => (
                          <div key={room} className="flex items-center space-x-2">
                            <Checkbox
                              id={`room-${room}`}
                              checked={activeFilters.includes(room)}
                              onCheckedChange={() => toggleFilter(room)}
                            />
                            <Label htmlFor={`room-${room}`} className="text-sm cursor-pointer">
                              {room}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="features">
                    <AccordionTrigger className="text-sm font-medium">Features</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {features.map((feature) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <Checkbox
                              id={`feature-${feature}`}
                              checked={activeFilters.includes(feature)}
                              onCheckedChange={() => toggleFilter(feature)}
                            />
                            <Label htmlFor={`feature-${feature}`} className="text-sm cursor-pointer">
                              {feature}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Filters - Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="mb-4 lg:hidden">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {activeFilters.length > 0 && <Badge className="ml-2">{activeFilters.length}</Badge>}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {activeFilters.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2">Active Filters:</h3>
                      <div className="flex flex-wrap gap-2">
                        {activeFilters.map((filter) => (
                          <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                            {filter}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFilter(filter)}
                              className="h-4 w-4 p-0 hover:bg-transparent"
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove {filter} filter</span>
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" onClick={clearAllFilters} className="mt-2 h-8 text-xs">
                        Clear all
                      </Button>
                    </div>
                  )}

                  {/* Mobile Filter Sections - Same as desktop but in a sheet */}
                  <Accordion type="multiple" defaultValue={["category", "price", "color", "material"]}>
                    <AccordionItem value="category">
                      <AccordionTrigger className="text-sm font-medium">Category</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox
                                id={`mobile-category-${category}`}
                                checked={activeFilters.includes(category)}
                                onCheckedChange={() => toggleFilter(category)}
                              />
                              <Label htmlFor={`mobile-category-${category}`} className="text-sm cursor-pointer">
                                {category}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Other accordion items similar to desktop */}
                    {/* ... */}
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>

            {/* Products */}
            <div className="flex-1">
              {/* Sort and View Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
                  <Select defaultValue="featured">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="best-selling">Best Selling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">View:</span>
                  <Button
                    variant={gridView === "grid" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGridView("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Button
                    variant={gridView === "compact" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGridView("compact")}
                  >
                    <Grid2X2 className="h-4 w-4" />
                    <span className="sr-only">Compact view</span>
                  </Button>
                  <span className="text-sm text-muted-foreground ml-4">
                    Showing <strong>1-24</strong> of <strong>96</strong> products
                  </span>
                </div>
              </div>

              {/* Product Grid */}
              <div
                className={`grid gap-4 ${gridView === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1 sm:grid-cols-2"
                  }`}
              >
                {shopProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`group relative overflow-hidden rounded-lg bg-background border hover:border-primary transition-colors ${gridView === "compact" ? "flex gap-4" : ""
                      }`}
                  >
                    <div className={`${gridView === "compact" ? "w-1/3 flex-shrink-0" : "w-full"} overflow-hidden`}>
                      <div className="relative aspect-square w-full">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {product.isNew && (
                          <div className="absolute left-2 top-2 z-10">
                            <Badge className="bg-primary">New</Badge>
                          </div>
                        )}
                        {product.discount > 0 && (
                          <div className="absolute right-2 top-2 z-10">
                            <Badge variant="destructive">-{product.discount}%</Badge>
                          </div>
                        )}
                        <div className="absolute right-2 bottom-2 z-10">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <Heart className="h-4 w-4" />
                            <span className="sr-only">Add to wishlist</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className={`${gridView === "compact" ? "flex-1" : ""} p-4`}>
                      <div className="mb-2 flex items-center gap-2">
                        {product.colors.map((color) => (
                          <div key={color} className="h-4 w-4 rounded-full border" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="mt-1 flex items-center gap-2">
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
                        <span className="text-xs text-muted-foreground">({product.reviews})</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      {gridView === "compact" && (
                        <div className="mt-4">
                          <Button size="sm">Add to Cart</Button>
                        </div>
                      )}
                    </div>
                    {gridView !== "compact" && (
                      <div className="absolute inset-x-0 bottom-0 h-12 bg-background p-2 opacity-0 transition-all group-hover:opacity-100">
                        <Button className="w-full h-full text-xs">Add to Cart</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" disabled>
                    <ChevronDown className="h-4 w-4 rotate-90" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8">
                    3
                  </Button>
                  <span>...</span>
                  <Button variant="outline" size="sm" className="h-8 w-8">
                    8
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                    <span className="sr-only">Next page</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-medium">Shop</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Blackout Curtains
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Sheer Curtains
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Valances
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">Customer Service</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Sustainability
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">Connect</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Pinterest
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    YouTube
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} ElegantDrapes. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Sample data
const categories = [
  "Blackout Curtains",
  "Sheer Curtains",
  "Valances",
  "Curtain Rods",
  "Tiebacks",
  "Drapes",
  "Window Panels",
  "Kitchen Curtains",
]

const colors = [
  { name: "White", hex: "#ffffff" },
  { name: "Beige", hex: "#f5f5dc" },
  { name: "Gray", hex: "#808080" },
  { name: "Blue", hex: "#0000ff" },
  { name: "Green", hex: "#008000" },
  { name: "Red", hex: "#ff0000" },
  { name: "Black", hex: "#000000" },
  { name: "Yellow", hex: "#ffff00" },
]

const materials = ["Cotton", "Linen", "Polyester", "Silk", "Velvet", "Lace", "Blackout Fabric", "Thermal Insulated"]

const rooms = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Dining Room", "Office", "Kids Room"]

const features = [
  "Blackout",
  "Noise Reducing",
  "Thermal Insulated",
  "Energy Efficient",
  "Machine Washable",
  "Wrinkle Resistant",
  "UV Protection",
]

const shopProducts = [
  {
    id: 1,
    name: "Luxe Velvet Blackout Curtains",
    price: 89.99,
    originalPrice: 119.99,
    rating: 5,
    reviews: 124,
    image: "/placeholder.svg?height=300&width=300",
    isNew: true,
    discount: 25,
    colors: ["#2c3e50", "#34495e", "#7f8c8d"],
  },
  {
    id: 2,
    name: "Linen Blend Sheer Curtains",
    price: 59.99,
    rating: 4,
    reviews: 86,
    image: "/placeholder.svg?height=300&width=300",
    isNew: false,
    discount: 0,
    colors: ["#ecf0f1", "#bdc3c7", "#95a5a6"],
  },
  {
    id: 3,
    name: "Thermal Insulated Drapes",
    price: 79.99,
    originalPrice: 99.99,
    rating: 5,
    reviews: 210,
    image: "/placeholder.svg?height=300&width=300",
    isNew: false,
    discount: 20,
    colors: ["#2980b9", "#3498db", "#9b59b6"],
  },
  {
    id: 4,
    name: "Decorative Window Valance",
    price: 34.99,
    rating: 4,
    reviews: 42,
    image: "/placeholder.svg?height=300&width=300",
    isNew: false,
    discount: 0,
    colors: ["#e74c3c", "#c0392b", "#d35400"],
  },
  {
    id: 5,
    name: "Blackout Curtains with Grommets",
    price: 69.99,
    originalPrice: 89.99,
    rating: 4,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300",
    isNew: false,
    discount: 22,
    colors: ["#2c3e50", "#34495e", "#7f8c8d"],
  },
  {
    id: 6,
    name: "Sheer Voile Curtain Panels",
    price: 29.99,
    rating: 4,
    reviews: 78,
    image: "/placeholder.svg?height=300&width=300",
    isNew: true,
    discount: 0,
    colors: ["#ecf0f1", "#bdc3c7"],
  },
  {
    id: 7,
    name: "Embroidered Curtain Set",
    price: 119.99,
    originalPrice: 149.99,
    rating: 5,
    reviews: 64,
    image: "/placeholder.svg?height=300&width=300",
    isNew: false,
    discount: 20,
    colors: ["#2980b9", "#3498db", "#9b59b6"],
  },
  {
    id: 8,
    name: "Kitchen Tier Curtains",
    price: 24.99,
    rating: 3,
    reviews: 32,
    image: "/placeholder.svg?height=300&width=300",
    isNew: false,
    discount: 0,
    colors: ["#e74c3c", "#c0392b", "#d35400"],
  },
  {
    id: 9,
    name: "Faux Silk Curtain Panels",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4,
    reviews: 92,
    image: "/placeholder.svg?height=300&width=300",
    isNew: false,
    discount: 28,
    colors: ["#2c3e50", "#34495e", "#7f8c8d"],
  },
  {
    id: 10,
    name: "Patterned Room Darkening Curtains",
    price: 74.99,
    rating: 4,
    reviews: 48,
    image: "/placeholder.svg?height=300&width=300",
    isNew: true,
    discount: 0,
    colors: ["#ecf0f1", "#bdc3c7", "#95a5a6"],
  },
  {
    id: 11,
    name: "Outdoor Curtains for Patio",
    price: 89.99,
    originalPrice: 109.99,
    rating: 5,
    reviews: 36,
    image: "/placeholder.svg?height=300&width=300",
    isNew: false,
    discount: 18,
    colors: ["#2980b9", "#3498db"],
  },
  {
    id: 12,
    name: "Lace Trim Curtain Set",
    price: 64.99,
    rating: 4,
    reviews: 28,
    image: "/placeholder.svg?height=300&width=300",
    isNew: false,
    discount: 0,
    colors: ["#e74c3c", "#c0392b", "#d35400"],
  },
]


