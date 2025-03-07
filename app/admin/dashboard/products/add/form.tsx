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
import { toast as sonnerToast } from "sonner";
import { Category, Discount } from "@/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { startTransition, useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { AutoComplete } from "@/components/ui/autocomplete";
import { useQuery } from "@tanstack/react-query";
import { Loader, RefreshCw, Save, X } from "lucide-react";
import { createNewProduct } from "./actions";
import ImageUpload from "./image-upload";
import { CldImage } from "next-cloudinary";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface UploadedImages {
  public_id: string;
  secure_url: string;
  url: string;
  thumbnail_url: string;
  bytes: number;
  height: number;
  width: number;
}
export default function ProductForm({
  categories,
  discounts,
}: {
  categories: Category[];
  discounts: Discount[];
}) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImages[]>([]);

  // Callback function to handle uploaded image info
  // Update handleUploadSuccess to check for duplicates
  const handleUploadSuccess = (fileInfo: UploadedImages) => {
    setUploadedImages((prev) => {
      // Check if image already exists
      const exists = prev.some((img) => img.public_id === fileInfo.public_id);
      if (exists) {
        toast({
          title: "Duplicate Image",
          description: "This image has already been uploaded.",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, fileInfo];
    });
  };

  // Callback function to handle file removal
  const handleRemoveFile = (publicId: string) => {
    setUploadedImages((prev) =>
      prev.filter((file) => file.public_id !== publicId),
    );
  };

  // State for search values
  const [brandSearchValue, setBrandSearchValue] = useState<string>("");
  const [manufacturerSearchValue, setManufacturerSearchValue] =
    useState<string>("");
  const [warrantySearchValue, setWarrantySearchValue] = useState<string>("");

  // Queries for fetching data
  const { data: brandsData, isLoading: isBrandsLoading } = useQuery({
    queryKey: ["brandsData", brandSearchValue],
    queryFn: async () => {
      const response = await fetch(
        `/api/brands/filtered?filter=${brandSearchValue}`,
      );
      return response.json();
    },
  });

  const { data: manufacturersData, isLoading: isManufacturersLoading } =
    useQuery({
      queryKey: ["manufacturersData", manufacturerSearchValue],
      queryFn: async () => {
        const response = await fetch(
          `/api/manufacturers/filtered?filter=${manufacturerSearchValue}`,
        );
        return response.json();
      },
    });

  const { data: warrantiesData, isLoading: isWarrantiesLoading } = useQuery({
    queryKey: ["warrantiesData", warrantySearchValue],
    queryFn: async () => {
      const response = await fetch(
        `/api/warranties/filtered?filter=${warrantySearchValue}`,
      );
      return response.json();
    },
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "", // string
      description: "", // string
      thumbnail: "",
      price: 0, // number
      sku: "", // string
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
      images: [], //image urls from uploaded files in the widget
    },
  });

  useEffect(() => {
    form.setValue(
      "images",
      uploadedImages.map((img) => img.url),
    );
    form.setValue("thumbnail", uploadedImages[0]?.thumbnail_url || "");
  }, [uploadedImages, form]);

  const onSubmit = async (data: ProductFormData) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          formData.append(key, val.toString());
        });
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (typeof value === "number") {
        formData.append(key, value.toString());
      } else {
        formData.append(key, value as string);
      }
    });

    // Ensure 'images' is always an array
    if (data.images && !Array.isArray(data.images)) {
      data.images = [data.images];
    }

    // Display the form data for debugging
    sonnerToast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>,
    );

    startTransition(() => {
      formAction(formData);
    });
  };

  const [state, formAction, isPending] = useActionState(createNewProduct, {
    message: "",
    success: false,
  });

  return (
    <Form {...form}>
      <ImageUpload onUploadSuccess={handleUploadSuccess} />
      <form
        action={formAction}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-lg border shadow-black p-2 rounded-md"
      >
        {state.success === false && state.message && (
          <Alert variant="destructive">
            <AlertTitle>خطا</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>*تصاویر محصول</FormLabel>
              <FormControl>
                <input type="hidden" {...field} />
              </FormControl>
              {/* Preview Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <CldImage
                        src={file.thumbnail_url}
                        alt="Uploaded Image"
                        width={150}
                        height={150}
                        className="rounded-md object-cover w-full h-full"
                      />
                      <Button
                        onClick={() => handleRemoveFile(file.public_id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full sm:opacity-0 group-hover:opacity-100 transition-opacity"
                        size="icon"
                        variant="destructive"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                        <span className="sr-only">Remove image</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <FormDescription>
                تصاویر آپلود شده محصول را اینجا مشاهده کنید
              </FormDescription>
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
            name="sku"
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
        <div className="flex justify-between px-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            <RefreshCw className="w-4 h-4 " />
            ریست
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader className="w-4 h-4  animate-spin" />
            ) : (
              <Save className="w-4 h-4 " />
            )}
            {isPending ? "درحال ذخیره..." : "ذخیره"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
