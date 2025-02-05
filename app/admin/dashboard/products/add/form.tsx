"use client";

import { productSchema, ProductSchemaType } from "@/types/zod-schemas/products";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Category } from "@/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { AutoComplete } from "@/components/ui/autocomplete";
import { useQuery } from "@tanstack/react-query";

export default function ProductForm({
  categories,
}: {
  categories: Category[];
}) {
  // State for search values
  const [brandSearchValue, setBrandSearchValue] = useState<string>("");
  const [manufacturerSearchValue, setManufacturerSearchValue] =
    useState<string>("");
  //const [discountSearchValue, setDiscountSearchValue] = useState<string>("");
  const [warrantySearchValue, setWarrantySearchValue] = useState<string>("");

  // Queries for fetching data
  const { data: brandsData, isLoading: isBrandsLoading } = useQuery({
    queryKey: ["brandsData", brandSearchValue],
    queryFn: async () => {
      const response = await fetch(`/api/brands?filter=${brandSearchValue}`);
      return response.json();
    },
  });

  const { data: manufacturersData, isLoading: isManufacturersLoading } =
    useQuery({
      queryKey: ["manufacturersData", manufacturerSearchValue],
      queryFn: async () => {
        const response = await fetch(
          `/api/manufacturers?filter=${manufacturerSearchValue}`,
        );
        return response.json();
      },
    });

  //const { data: discountsData, isLoading: isDiscountsLoading } = useQuery({
  //  queryKey: ["discountsData", discountSearchValue],
  //  queryFn: async () => {
  //    const response = await fetch(`/api/discounts?filter=${discountSearchValue}`);
  //    return response.json();
  //  },
  //});

  const { data: warrantiesData, isLoading: isWarrantiesLoading } = useQuery({
    queryKey: ["warrantiesData", warrantySearchValue],
    queryFn: async () => {
      const response = await fetch(
        `/api/warranties?filter=${warrantySearchValue}`,
      );
      return response.json();
    },
  });

  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "", // required
      description: "", // required
      price: 0, // required
      SKU: "", // required
      stock: 0, // required
      category_id: undefined, // required
      min_order_quantity: null,
      max_order_quantity: null,
      weight: null,
      length: null,
      width: null,
      height: null,
      brand_id: null,
      newBrand: "",
      manufacturer_id: null,
      discount_id: null,
      warranty_id: null,
      //created_at: undefined,
      //updated_at: undefined,
      //deleted_at: null,
    },
  });

  const onSubmit = async (data: ProductSchemaType) => {
    try {
      console.log(data);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>,
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-lg border shadow-black p-2 rounded-md"
      >
        {/* Brand Field */}
        <FormField
          control={form.control}
          name="brand_id"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>برند محصول</FormLabel>
              <div className="flex gap-4 w-full [&>*:first-child]:flex-1">
                <FormControl>
                  <AutoComplete
                    selectedValue={field.value?.toString() || ""}
                    onSelectedValueChange={(value) =>
                      field.onChange(parseInt(value))
                    }
                    searchValue={brandSearchValue}
                    onSearchValueChange={setBrandSearchValue}
                    items={brandsData ?? []}
                    isLoading={isBrandsLoading}
                    emptyMessage="No brands found."
                    placeholder="Search brands..."
                  />
                </FormControl>
                <Link
                  className={buttonVariants({ variant: "link" })}
                  href="/admin/dashboard/products/brands"
                >
                  برند جدید
                </Link>
              </div>
              <FormDescription>برند محصول را وارد کنید</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Manufacturer Field */}
        <FormField
          control={form.control}
          name="manufacturer_id"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>تولید کننده</FormLabel>
              <div className="flex gap-4 w-full [&>*:first-child]:flex-1">
                <FormControl>
                  <AutoComplete
                    selectedValue={field.value?.toString() || ""}
                    onSelectedValueChange={(value) =>
                      field.onChange(parseInt(value))
                    }
                    searchValue={manufacturerSearchValue}
                    onSearchValueChange={setManufacturerSearchValue}
                    items={manufacturersData ?? []}
                    isLoading={isManufacturersLoading}
                    emptyMessage="No manufacturers found."
                    placeholder="Search manufacturers..."
                  />
                </FormControl>
                <Link
                  className={buttonVariants({ variant: "link" })}
                  href="/admin/dashboard/products/manufacturers"
                >
                  تولید کننده جدید
                </Link>
              </div>
              <FormDescription>تولید کننده را وارد کنید</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Discount Field */}
        {/* <FormField 
        //   control={form.control}
        //   name="discount_id"
        //   render={({ field }) => (
        //     <FormItem className="w-full">
        //       <FormLabel>تخفیف</FormLabel>
        //       <div className="flex gap-4 w-full [&>*:first-child]:flex-1">
        //         <FormControl>
        //           <AutoComplete
        //             selectedValue={field.value?.toString() || ""}
        //             onSelectedValueChange={(value) => field.onChange(parseInt(value))}
        //             searchValue={discountSearchValue}
        //             onSearchValueChange={setDiscountSearchValue}
        //             items={discountsData ?? []}
        //             isLoading={isDiscountsLoading}
        //             emptyMessage="No discounts found."
        //             placeholder="Search discounts..."
        //           />
        //         </FormControl>
        //         <Link
        //           className={buttonVariants({ variant: "link" })}
        //           href="/admin/dashboard/products/discounts"
        //         >
        //           تخفیف جدید
        //         </Link>
        //       </div>
        //       <FormDescription>تخفیف را وارد کنید</FormDescription>
        //       <FormMessage />
        //     </FormItem>
        //   )}
        // />
*/}
        {/* Warranty Field */}
        <FormField
          control={form.control}
          name="warranty_id"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>گارانتی</FormLabel>
              <div className="flex gap-4 w-full [&>*:first-child]:flex-1">
                <FormControl>
                  <AutoComplete
                    selectedValue={field.value?.toString() || ""}
                    onSelectedValueChange={(value) =>
                      field.onChange(parseInt(value))
                    }
                    searchValue={warrantySearchValue}
                    onSearchValueChange={setWarrantySearchValue}
                    items={warrantiesData ?? []}
                    isLoading={isWarrantiesLoading}
                    emptyMessage="No warranties found."
                    placeholder="Search warranties..."
                  />
                </FormControl>
                <Link
                  className={buttonVariants({ variant: "link" })}
                  href="/admin/dashboard/products/warranties"
                >
                  گارانتی جدید
                </Link>
              </div>
              <FormDescription>گارانتی را وارد کنید</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>*نام محصول</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>نام محصول را وارد کنید</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>*توضیحات</FormLabel>
              <FormControl>
                <Textarea placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                توضیحات درباره محصول را وارد کنید
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>*قیمت (تومان)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder=""
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>قیمت محصول را وارد کنید</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="sm:flex flex-wrap justify-between gap-4 [&>*]:flex-1">
          <FormField
            control={form.control}
            name="SKU"
            render={({ field }) => (
              <FormItem>
                <FormLabel>*کد کالا</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  کد یا شناسه کالا را وارد کنید{" "}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>*تعداد</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder=""
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : "",
                      )
                    }
                  />
                </FormControl>
                <FormDescription>
                  تعداد محصول موجود در انبار را وارد کنید
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>*دسته بندی</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value, 10))} // Convert to number
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب دسته‌بندی" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category: Category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                دسته‌بندی مستقیم (نزدیکترین دسته‌بندی) را وارد کنید{" "}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="sm:flex flex-wrap items-center justify-between gap-4 [&>*]:flex-1">
          <FormField
            control={form.control}
            name="min_order_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حداقل سفارش</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder=""
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormDescription>
                  حداقل مقدار/تعداد قابل سفارش را وارد کنید
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max_order_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>حداکثر سفارش</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder=""
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormDescription>
                  حداکثر مقدار/تعداد قابل سفارش را وارد کنید
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="sm:flex flex-wrap items-center justify-between gap-4 [&>*]:flex-1">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>وزن (گرم)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder=""
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormDescription>وزن محصول با احتساب بسته‌بندی</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>طول (سانتیمتر)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder=""
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormDescription>طول محصول با احتساب بسته‌بندی</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>عرض (سانتیمتر)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder=""
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormDescription>عرض محصول با احتساب بسته‌بندی</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ارتفاع (سانتیمتر)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder=""
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormDescription>
                  ارتفاع محصول با احتساب بسته‌بندی
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

//
//import { useState } from "react";
//import { useQuery } from "@tanstack/react-query";
//
//export default function ProductForm({ categories }: { categories: Category[] }) {
//  // State for search values
//  const [brandSearchValue, setBrandSearchValue] = useState<string>("");
//  const [manufacturerSearchValue, setManufacturerSearchValue] = useState<string>("");
//  const [discountSearchValue, setDiscountSearchValue] = useState<string>("");
//  const [warrantySearchValue, setWarrantySearchValue] = useState<string>("");
//
//  // Queries for fetching data
//  const { data: brandsData, isLoading: isBrandsLoading } = useQuery({
//    queryKey: ["brandsData", brandSearchValue],
//    queryFn: async () => {
//      const response = await fetch(`/api/brands?filter=${brandSearchValue}`);
//      return response.json();
//    },
//  });
//
//  const { data: manufacturersData, isLoading: isManufacturersLoading } = useQuery({
//    queryKey: ["manufacturersData", manufacturerSearchValue],
//    queryFn: async () => {
//      const response = await fetch(`/api/manufacturers?filter=${manufacturerSearchValue}`);
//      return response.json();
//    },
//  });
//
//  const { data: discountsData, isLoading: isDiscountsLoading } = useQuery({
//    queryKey: ["discountsData", discountSearchValue],
//    queryFn: async () => {
//      const response = await fetch(`/api/discounts?filter=${discountSearchValue}`);
//      return response.json();
//    },
//  });
//
//  const { data: warrantiesData, isLoading: isWarrantiesLoading } = useQuery({
//    queryKey: ["warrantiesData", warrantySearchValue],
//    queryFn: async () => {
//      const response = await fetch(`/api/warranties?filter=${warrantySearchValue}`);
//      return response.json();
//    },
//  });
//
//  const form = useForm<ProductSchemaType>({
//    resolver: zodResolver(productSchema),
//    defaultValues: {
//      name: "",
//      description: "",
//      price: 0,
//      SKU: "",
//      stock: 0,
//      category_id: undefined,
//      min_order_quantity: null,
//      max_order_quantity: null,
//      weight: null,
//      length: null,
//      width: null,
//      height: null,
//      brand_id: null,
//      newBrand: "",
//      manufacturer_id: null,
//      discount_id: null,
//      warranty_id: null,
//    },
//  });
//
//  const onSubmit = async (data: ProductSchemaType) => {
//    try {
//      console.log(data);
//      toast(
//        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//        </pre>,
//      );
//    } catch (error) {
//      console.error("Form submission error", error);
//      toast.error("Failed to submit the form. Please try again.");
//    }
//  };
//
//  return (
//    <Form {...form}>
//      <form
//        onSubmit={form.handleSubmit(onSubmit)}
//        className="space-y-8 max-w-lg border shadow-black p-2 rounded-md"
//      >
//        {/* Brand Field */}
//        <FormField
//          control={form.control}
//          name="brand_id"
//          render={({ field }) => (
//            <FormItem className="w-full">
//              <FormLabel>برند محصول</FormLabel>
//              <div className="flex gap-4 w-full [&>*:first-child]:flex-1">
//                <FormControl>
//                  <AutoComplete
//                    selectedValue={field.value?.toString() || ""}
//                    onSelectedValueChange={(value) => field.onChange(parseInt(value))}
//                    searchValue={brandSearchValue}
//                    onSearchValueChange={setBrandSearchValue}
//                    items={brandsData ?? []}
//                    isLoading={isBrandsLoading}
//                    emptyMessage="No brands found."
//                    placeholder="Search brands..."
//                  />
//                </FormControl>
//                <Link
//                  className={buttonVariants({ variant: "link" })}
//                  href="/admin/dashboard/products/brands"
//                >
//                  برند جدید
//                </Link>
//              </div>
//              <FormDescription>برند محصول را وارد کنید</FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//
//        {/* Manufacturer Field */}
//        <FormField
//          control={form.control}
//          name="manufacturer_id"
//          render={({ field }) => (
//            <FormItem className="w-full">
//              <FormLabel>تولید کننده</FormLabel>
//              <div className="flex gap-4 w-full [&>*:first-child]:flex-1">
//                <FormControl>
//                  <AutoComplete
//                    selectedValue={field.value?.toString() || ""}
//                    onSelectedValueChange={(value) => field.onChange(parseInt(value))}
//                    searchValue={manufacturerSearchValue}
//                    onSearchValueChange={setManufacturerSearchValue}
//                    items={manufacturersData ?? []}
//                    isLoading={isManufacturersLoading}
//                    emptyMessage="No manufacturers found."
//                    placeholder="Search manufacturers..."
//                  />
//                </FormControl>
//                <Link
//                  className={buttonVariants({ variant: "link" })}
//                  href="/admin/dashboard/products/manufacturers"
//                >
//                  تولید کننده جدید
//                </Link>
//              </div>
//              <FormDescription>تولید کننده را وارد کنید</FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//
//        {/* Discount Field */}
//        <FormField
//          control={form.control}
//          name="discount_id"
//          render={({ field }) => (
//            <FormItem className="w-full">
//              <FormLabel>تخفیف</FormLabel>
//              <div className="flex gap-4 w-full [&>*:first-child]:flex-1">
//                <FormControl>
//                  <AutoComplete
//                    selectedValue={field.value?.toString() || ""}
//                    onSelectedValueChange={(value) => field.onChange(parseInt(value))}
//                    searchValue={discountSearchValue}
//                    onSearchValueChange={setDiscountSearchValue}
//                    items={discountsData ?? []}
//                    isLoading={isDiscountsLoading}
//                    emptyMessage="No discounts found."
//                    placeholder="Search discounts..."
//                  />
//                </FormControl>
//                <Link
//                  className={buttonVariants({ variant: "link" })}
//                  href="/admin/dashboard/products/discounts"
//                >
//                  تخفیف جدید
//                </Link>
//              </div>
//              <FormDescription>تخفیف را وارد کنید</FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//
//        {/* Warranty Field */}
//        <FormField
//          control={form.control}
//          name="warranty_id"
//          render={({ field }) => (
//            <FormItem className="w-full">
//              <FormLabel>گارانتی</FormLabel>
//              <div className="flex gap-4 w-full [&>*:first-child]:flex-1">
//                <FormControl>
//                  <AutoComplete
//                    selectedValue={field.value?.toString() || ""}
//                    onSelectedValueChange={(value) => field.onChange(parseInt(value))}
//                    searchValue={warrantySearchValue}
//                    onSearchValueChange={setWarrantySearchValue}
//                    items={warrantiesData ?? []}
//                    isLoading={isWarrantiesLoading}
//                    emptyMessage="No warranties found."
//                    placeholder="Search warranties..."
//                  />
//                </FormControl>
//                <Link
//                  className={buttonVariants({ variant: "link" })}
//                  href="/admin/dashboard/products/warranties"
//                >
//                  گارانتی جدید
//                </Link>
//              </div>
//              <FormDescription>گارانتی را وارد کنید</FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//
//        {/* Name Field */}
//        <FormField
//          control={form.control}
//          name="name"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel>*نام محصول</FormLabel>
//              <FormControl>
//                <Input placeholder="" {...field} />
//              </FormControl>
//              <FormDescription>نام محصول را وارد کنید</FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//
//        {/* Rest of the form fields */}
//        ...
//      </form>
//    </Form>
//  );
//}
