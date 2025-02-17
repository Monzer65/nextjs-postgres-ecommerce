"use client";

import { productSchema, ProductFormData } from "@/types/zod-schemas/products";
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
import { Category, Discount } from "@/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useState } from "react";
import Link from "next/link";
import { AutoComplete } from "@/components/ui/autocomplete";
import { useQuery } from "@tanstack/react-query";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { createNewProduct } from "./actions";

import SampleImage from "./sample-image";

export default function ProductForm({
  categories,
  discounts,
}: {
  categories: Category[];
  discounts: Discount[];
}) {
  // State for search values
  const [brandSearchValue, setBrandSearchValue] = useState<string>("");
  const [manufacturerSearchValue, setManufacturerSearchValue] =
    useState<string>("");
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

  const { data: warrantiesData, isLoading: isWarrantiesLoading } = useQuery({
    queryKey: ["warrantiesData", warrantySearchValue],
    queryFn: async () => {
      const response = await fetch(
        `/api/warranties?filter=${warrantySearchValue}`,
      );
      return response.json();
    },
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "", // string
      description: "", // string
      price: 0, // number
      SKU: "", // string
      stock: 0, // number
      category_id: undefined, // number (required by schema)
      min_order_quantity: null, // number | null
      max_order_quantity: null, // number | null
      weight: null, // number | null
      length: null, // number | null
      width: null, // number | null
      height: null, // number | null
      brand_id: null, // number | null
      manufacturer_id: null, // number | null
      discount_id: null, // number | null
      warranty_id: null, // number | null
      images: [], // File[]
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
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
  const [state, formAction, isPending] = useActionState(createNewProduct, {
    message: "",
    success: false,
  });

  return (
    <Form {...form}>
      <SampleImage />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-lg border shadow-black p-2 rounded-md"
      >
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
        {/* Brand Field */}
        <FormField
          control={form.control}
          name="brand_id"
          render={({ field }) => (
            <FormItem className="w-full relative">
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
                    emptyMessage="هیچ برندی یافت نشد."
                    placeholder="جستجوی برند..."
                  />
                </FormControl>
                {field.value && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => {
                      field.onChange(null); // Reset the field value
                      setBrandSearchValue(""); // Clear the search value
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
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
            <FormItem className="w-full relative">
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
                    emptyMessage="تولید کننده‌ای یافت نشد"
                    placeholder="جستجوی تولیدکننده..."
                  />
                </FormControl>
                {field.value && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => {
                      field.onChange(null); // Reset the field value
                      setManufacturerSearchValue(""); // Clear the search value
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

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
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => {
            const handleAddFiles = (files: FileList | null) => {
              if (!files) return;
              const newFiles = Array.from(files);
              const updatedFiles = [...(field.value || []), ...newFiles];
              field.onChange(updatedFiles);
            };

            const handleRemoveFile = (index: number) => {
              const updatedFiles = field.value.filter((_, i) => i !== index);
              field.onChange(updatedFiles);
            };

            const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              e.stopPropagation();
            };

            const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddFiles(e.dataTransfer.files);
            };

            return (
              <FormItem>
                <FormLabel>*تصاویر محصول</FormLabel>
                <FormControl>
                  <div
                    className="flex items-center justify-center w-full"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">
                            برای افزودن تصویر کلیک کنید
                          </span>{" "}
                          یا فایل‌ها را اینجا بکشید
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG یا GIF (حداکثر 5Mb)
                        </p>
                      </div>
                      <Input
                        id="dropzone-file"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAddFiles(e.target.files)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        name={field.name}
                      />
                    </label>
                  </div>
                </FormControl>
                <FormDescription>تصاویر محصول را انتخاب کنید</FormDescription>
                <FormMessage />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {field.value?.map((file, index) => {
                    const url = URL.createObjectURL(file);
                    return (
                      <div key={index} className="relative group">
                        <Image
                          src={url}
                          alt=""
                          width={200}
                          height={200}
                          className="object-cover w-full h-40 rounded-lg"
                          onLoad={() => URL.revokeObjectURL(url)}
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveFile(index);
                          }}
                          type="button"
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X className="w-4 h-4" />
                          <span className="sr-only">حذف تصویر</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </FormItem>
            );
          }}
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
        />{" "}
        <FormField
          control={form.control}
          name="discount_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تخفیف</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value, 10))} // Convert to number
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب تخفیف" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {discounts.map((discount: Discount) => (
                    <SelectItem
                      key={discount.id}
                      value={discount.id.toString()}
                    >
                      {discount.discount_value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>مقدار تخفیف را وارد کنید </FormDescription>
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
        {/* Warranty Field */}
        <FormField
          control={form.control}
          name="warranty_id"
          render={({ field }) => (
            <FormItem className="w-full relative">
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
                    emptyMessage="هیچ ضمانتی یافت نشد"
                    placeholder="جستجوی ضمانت‌ها..."
                  />
                </FormControl>
                {field.value && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => {
                      field.onChange(null); // Reset the field value
                      setWarrantySearchValue(""); // Clear the search value
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
