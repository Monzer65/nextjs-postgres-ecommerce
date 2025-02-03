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
import { Category } from "@/db/schema";
import { Textarea } from "@/components/ui/textarea";
import Autocomplete from "@/components/ui/autocomplete";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
export default function ProductForm({ dropdownData }: { dropdownData: any }) {
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

  const fetchBrands = async (query: string) => {
    // Implement actual API call
    return dropdownData.brands.filter((brand: any) =>
      brand.name.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const handleCreateBrand = async (name: string) => {
    // Implement API call to create brand
    const newBrand = await fetch("/api/brands", {
      method: "POST",
      body: JSON.stringify({ name }),
    }).then((res) => res.json());

    form.setValue("brand_id", newBrand.id);
    form.setValue("newBrand", "");
  };

  const onSubmit = async (data: ProductSchemaType) => {
    try {
      if (data.newBrand) {
        const newBrand = await handleCreateBrand(data.newBrand);
        //data.brand_id = newBrand.id;
      }

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
            <FormItem className="flex flex-col">
              <FormLabel>brand</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? dropdownData.brands.find(
                          (brand: any) => brand.value === field.value,
                        )?.label
                        : "Select brand"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search framework..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {dropdownData.brands.map((brand: any) => (
                          <CommandItem
                            value={brand.label}
                            key={brand.value}
                            onSelect={() => {
                              form.setValue("brand_id", brand.value);
                            }}
                          >
                            {brand.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                brand.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the brand that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Autocomplete<any>
          onChange={(value) => {
            form.setValue("brand_id", Number(value));
            form.setValue("newBrand", "");
          }}
          onCreate={(name) => {
            form.setValue("newBrand", name);
            form.setValue("brand_id", null);
          }}
          fetchSuggestions={fetchBrands}
          placeholder="Select or create brand..."
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

//"use client";
//
//import { useForm } from "react-hook-form";
//import { zodResolver } from "@hookform/resolvers/zod";
//import { createNewProduct } from "./actions";
//import { Button } from "@/components/ui/button";
//import {
//  Form,
//  FormControl,
//  FormDescription,
//  FormField,
//  FormItem,
//  FormLabel,
//  FormMessage,
//} from "@/components/ui/form";
//import { Input } from "@/components/ui/input";
//import { useToast } from "@/hooks/use-toast";
//import { useActionState } from "react";
//import {
//  Select,
//  SelectContent,
//  SelectItem,
//  SelectTrigger,
//  SelectValue,
//} from "@/components/ui/select";
//import {
//  newProductSchema,
//  NewProductSchema,
//} from "@/types/zod-schemas/products";
//import { Category } from "@/db/schema";
//
//export default function ProductForm({ dropdownData }: { dropdownData: any }) {
//  const { brands, manufacturers, categories, discounts, warranties } =
//    dropdownData;
//
//  const form = useForm<NewProductSchema>({
//    resolver: zodResolver(newProductSchema),
//    defaultValues: {
//      name: "",
//      description: "",
//      price: 0,
//      SKU: "",
//      stock: 0,
//      min_order_quantity: undefined,
//      max_order_quantity: undefined,
//      weight: undefined,
//      length: undefined,
//      width: undefined,
//      height: undefined,
//      brand_id: undefined,
//      manufacturer_id: undefined,
//      category_id: undefined,
//      discount_id: undefined,
//      warranty_id: undefined,
//    },
//  });
//
//  const [state, formAction] = useActionState(createNewProduct, {
//    message: "",
//    success: false,
//  });
//
//  const onSubmit = (data: NewProductSchema) => {
//    const formData = new FormData();
//    Object.entries(data).forEach(([key, value]) => {
//      if (value !== undefined) {
//        formData.append(key, value.toString());
//      }
//    });
//    formAction(formData);
//  };
//
//  return (
//    <Form {...form}>
//      <form
//        action={formAction}
//        onSubmit={form.handleSubmit(onSubmit)}
//        className="space-y-8 max-w-3xl"
//      >
//        <FormField
//          control={form.control}
//          name="category_id"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel>دسته بندی</FormLabel>
//              <Select
//                onValueChange={(value) =>
//                  field.onChange(value ? 0.parseInt(value) : undefined)
//                }
//                defaultValue={field.value?.toString()}
//              >
//                <FormControl>
//                  <SelectTrigger>
//                    <SelectValue placeholder="یک دسته‌بندی را انتخاب کنید" />
//                  </SelectTrigger>
//                </FormControl>
//                <SelectContent>
//                  {categories.map((category: Category) => (
//                    <SelectItem
//                      key={category.id}
//                      value={category.id.toString()}
//                    >
//                      {category.name}
//                    </SelectItem>
//                  ))}
//                </SelectContent>
//              </Select>
//              <FormDescription>
//                نزدیکترین دسته بندی را انتخاب کنید (اختیاری)
//              </FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//
//        <FormField
//          control={form.control}
//          name="name"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel>Name</FormLabel>
//              <FormControl>
//                <Input {...field} />
//              </FormControl>
//              <FormDescription>Product name</FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//        <FormField
//          control={form.control}
//          name="description"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel>Description</FormLabel>
//              <FormControl>
//                <Input {...field} />
//              </FormControl>
//              <FormDescription>Product description</FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//        <FormField
//          control={form.control}
//          name="price"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel>Price</FormLabel>
//              <FormControl>
//                <Input
//                  type="0"
//                  {...field}
//                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
//                />
//              </FormControl>
//              <FormDescription>Product price</FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//        <FormField
//          control={form.control}
//          name="SKU"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel>SKU</FormLabel>
//              <FormControl>
//                <Input {...field} />
//              </FormControl>
//              <FormDescription>Stock Keeping Unit</FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//        <FormField
//          control={form.control}
//          name="stock"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel>Stock</FormLabel>
//              <FormControl>
//                <Input
//                  type="0"
//                  {...field}
//                  onChange={(e) => field.onChange(parseInt(e.target.value))}
//                />
//              </FormControl>
//              <FormDescription>Available stock</FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//        <FormField
//          control={form.control}
//          name="min_order_quantity"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel>Minimum Order Quantity</FormLabel>
//              <FormControl>
//                <Input
//                  type="0"
//                  {...field}
//                  onChange={(e) =>
//                    field.onChange(
//                      e.target.value ? parseInt(e.target.value) : undefined,
//                    )
//                  }
//                />
//              </FormControl>
//              <FormDescription>
//                Minimum order quantity (optional)
//              </FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//        <FormField
//          control={form.control}
//          name="max_order_quantity"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel>Maximum Order Quantity</FormLabel>
//              <FormControl>
//                <Input
//                  type="0"
//                  {...field}
//                  onChange={(e) =>
//                    field.onChange(
//                      e.target.value ? parseInt(e.target.value) : undefined,
//                    )
//                  }
//                />
//              </FormControl>
//              <FormDescription>
//                Maximum order quantity (optional)
//              </FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//        <FormField
//          control={form.control}
//          name="weight"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel>Weight</FormLabel>
//              <FormControl>
//                <Input
//                  type="0"
//                  {...field}
//                  onChange={(e) =>
//                    field.onChange(
//                      e.target.value ? parseFloat(e.target.value) : undefined,
//                    )
//                  }
//                />
//              </FormControl>
//              <FormDescription>Product weight (optional)</FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//        <FormField
//          control={form.control}
//          name="length"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel>Length</FormLabel>
//              <FormControl>
//                <Input
//                  type="0"
//                  {...field}
//                  onChange={(e) =>
//                    field.onChange(
//                      e.target.value ? parseFloat(e.target.value) : undefined,
//                    )
//                  }
//                />
//              </FormControl>
//              <FormDescription>Product length (optional)</FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//        <FormField
//          control={form.control}
//          name="width"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel>Width</FormLabel>
//              <FormControl>
//                <Input
//                  type="0"
//                  {...field}
//                  onChange={(e) =>
//                    field.onChange(
//                      e.target.value ? parseFloat(e.target.value) : undefined,
//                    )
//                  }
//                />
//              </FormControl>
//              <FormDescription>Product width (optional)</FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//        <FormField
//          control={form.control}
//          name="height"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel>Height</FormLabel>
//              <FormControl>
//                <Input
//                  type="0"
//                  {...field}
//                  onChange={(e) =>
//                    field.onChange(
//                      e.target.value ? parseFloat(e.target.value) : undefined,
//                    )
//                  }
//                />
//              </FormControl>
//              <FormDescription>Product height (optional)</FormDescription>
//              <FormMessage />
//            </FormItem>
//          )}
//        />
//        <Button type="submit">Create Product</Button>
//      </form>
//    </Form>
//  );
//}
//
// 'use client';

// import { CustomerField } from '@/app/lib/definitions';
// import Link from 'next/link';
// import {
//   CheckIcon,
//   ClockIcon,
//   CurrencyDollarIcon,
//   UserCircleIcon,
// } from '@heroicons/react/24/outline';
// import { Button } from '@/app/ui/button';
// import { createInvoice, State } from '@/app/lib/actions';
// import { useActionState } from 'react';

// export default function Form({ customers }: { customers: CustomerField[] }) {
//   const initialState: State = { message: null, errors: {} };
//   const [state, formAction] = useActionState(createInvoice, initialState);

//   return (
//     <form action={formAction}>
//       <div className="rounded-md bg-gray-50 p-4 md:p-6">
//         {/* Customer Name */}
//         <div className="mb-4">
//           <label htmlFor="customer" className="mb-2 block text-sm font-medium">
//             Choose customer
//           </label>
//           <div className="relative">
//             <select
//               id="customer"
//               name="customerId"
//               className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//               defaultValue=""
//               aria-describedby="customer-error"
//             >
//               <option value="" disabled>
//                 Select a customer
//               </option>
//               {customers.map((customer) => (
//                 <option key={customer.id} value={customer.id}>
//                   {customer.name}
//                 </option>
//               ))}
//             </select>
//             <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
//           </div>

//           <div id="customer-error" aria-live="polite" aria-atomic="true">
//             {state.errors?.customerId &&
//               state.errors.customerId.map((error: string) => (
//                 <p className="mt-2 text-sm text-red-500" key={error}>
//                   {error}
//                 </p>
//               ))}
//           </div>
//         </div>

//         {/* Invoice Amount */}
//         <div className="mb-4">
//           <label htmlFor="amount" className="mb-2 block text-sm font-medium">
//             Choose an amount
//           </label>
//           <div className="relative mt-2 rounded-md">
//             <div className="relative">
//               <input
//                 id="amount"
//                 name="amount"
//                 type="0"
//                 step="0.01"
//                 placeholder="Enter USD amount"
//                 className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//                 aria-describedby="amount-error"
//               />
//               <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
//             </div>
//           </div>

//           <div id="amount-error" aria-live="polite" aria-atomic="true">
//             {state.errors?.amount &&
//               state.errors.amount.map((error: string) => (
//                 <p className="mt-2 text-sm text-red-500" key={error}>
//                   {error}
//                 </p>
//               ))}
//           </div>
//         </div>

//         {/* Invoice Status */}
//         <fieldset>
//           <legend className="mb-2 block text-sm font-medium">
//             Set the invoice status
//           </legend>
//           <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
//             <div className="flex gap-4">
//               <div className="flex items-center">
//                 <input
//                   id="pending"
//                   name="status"
//                   type="radio"
//                   value="pending"
//                   className="text-white-600 h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 focus:ring-2"
//                 />
//                 <label
//                   htmlFor="pending"
//                   className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
//                 >
//                   Pending <ClockIcon className="h-4 w-4" />
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   id="paid"
//                   name="status"
//                   type="radio"
//                   value="paid"
//                   className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
//                 />
//                 <label
//                   htmlFor="paid"
//                   className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
//                 >
//                   Paid <CheckIcon className="h-4 w-4" />
//                 </label>
//               </div>
//             </div>
//           </div>
//           <div id="status-error" aria-live="polite" aria-atomic="true">
//             {state.errors?.status &&
//               state.errors.status.map((error: string) => (
//                 <p className="mt-2 text-sm text-red-500" key={error}>
//                   {error}
//                 </p>
//               ))}
//           </div>
//         </fieldset>

//         <div aria-live="polite" aria-atomic="true">
//           {state.message ? (
//             <p className="mt-2 text-sm text-red-500">{state.message}</p>
//           ) : null}
//         </div>
//       </div>
//       <div className="mt-6 flex justify-end gap-4">
//         <Link
//           href="/dashboard/invoices"
//           className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
//         >
//           Cancel
//         </Link>
//         <Button type="submit">Create Invoice</Button>
//       </div>
//     </form>
//   );
// }
