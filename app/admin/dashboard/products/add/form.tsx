"use client";

import { productSchema, ProductSchemaType } from "@/types/zod-schemas/products";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Brand, Category } from "@/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useActionState, useState } from "react";
import Link from "next/link";

export default function ProductForm({ dropdownData }: { dropdownData: any }) {
  const [brandList, setBrandList] = useState(dropdownData.brands);
  const [manufacturerList, setManufacturerList] = useState(
    dropdownData.manufacturers,
  );
  const [newBrand, setNewBrand] = useState("");
  const [newManufacturer, setNewManufacturer] = useState("");

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
        <FormField
          control={form.control}
          name="brand_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <div className="flex gap-2">
                <Select
                  onValueChange={field.onChange}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brandList.map((brand: Brand) => (
                      <SelectItem key={brand.id} value={String(brand.id)}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Link href="/admin/dashboard/products/brands">برند جدید</Link>
              </div>
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
                  {dropdownData.categories.map((category: Category) => (
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
