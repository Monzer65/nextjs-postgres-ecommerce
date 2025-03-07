"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { startTransition, useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { updateProductAction } from "./actions";
import { toast } from "sonner";
import {
    productEditSchema,
    type ProductEditFormData,
    prepareProductEditData,
} from "@/types/zod-schemas/products";
import { useQuery } from "@tanstack/react-query";
import { Brand, Manufacturer, Warranty } from "@/db/schema";

const categories = [
    { id: 1, name: "موبایل" },
    { id: 2, name: "لپ تاپ" },
    { id: 3, name: "لوازم جانبی" },
    { id: 4, name: "خانه هوشمند" },
];

const discounts = [
    { id: 1, name: "تخفیف ۱۰٪" },
    { id: 2, name: "تخفیف ۲۰٪" },
    { id: 3, name: "تخفیف ویژه" },
];

export function ProductEditForm({ product }: { product: any }) {
    const { data: brands } = useQuery({
        queryKey: ["brandsData"],
        queryFn: async () => {
            const response = await fetch(`/api/brands`);
            return response.json();
        },
    });

    const { data: manufacturers } = useQuery({
        queryKey: ["manufacturersData"],
        queryFn: async () => {
            const response = await fetch(`/api/manufacturers`);
            return response.json();
        },
    });

    const { data: warranties } = useQuery({
        queryKey: ["warrantiesData"],
        queryFn: async () => {
            const response = await fetch(`/api/warranties`);
            return response.json();
        },
    });

    const [imagePreview, setImagePreview] = useState(product.thumbnail || "");
    const [images, setImages] = useState<string[]>(product.images || []);
    const [newImageUrl, setNewImageUrl] = useState("");
    const router = useRouter();

    // Initialize the form with default values from the product
    const form = useForm<ProductEditFormData>({
        resolver: zodResolver(productEditSchema),
        defaultValues: prepareProductEditData(product),
    });

    // Handle thumbnail upload
    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("حجم تصویر باید کمتر از ۲ مگابایت باشد");
            return;
        }

        // Check file type
        if (!file.type.includes("image/")) {
            toast.error("فایل انتخاب شده باید تصویر باشد");
            return;
        }

        // Create a preview URL
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setImagePreview(event.target.result as string);
                form.setValue("thumbnail", event.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    // Handle adding a new image URL
    const handleAddImage = () => {
        if (!newImageUrl) return;

        try {
            // Basic URL validation
            new URL(newImageUrl);

            // Add to images array
            const updatedImages = [...images, newImageUrl];
            setImages(updatedImages);
            form.setValue("images", updatedImages);
            setNewImageUrl("");
        } catch (e) {
            toast.error("آدرس تصویر معتبر نیست");
        }
    };

    // Handle removing an image
    const handleRemoveImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        form.setValue("images", updatedImages);
    };

    // Handle form submission
    //async function onSubmit(values: ProductEditFormData) {
    //    setIsSubmitting(true);
    //    try {
    //        await updateProductAction(product.id, values);
    //        toast.success("محصول با موفقیت به‌روزرسانی شد");
    //        router.push("/admin/dashboard/products");
    //        router.refresh();
    //    } catch (error) {
    //        toast.error("خطا در به‌روزرسانی محصول");
    //        console.error(error);
    //    } finally {
    //        setIsSubmitting(false);
    //    }
    //}
    //
    //
    const onSubmit = async (data: ProductEditFormData) => {
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

        startTransition(() => {
            formAction(formData);
        });
    };

    const [state, formAction, isPending] = useActionState(updateProductAction, {
        message: "",
        success: false,
    });

    return (
        <Form {...form}>
            <form
                action={formAction}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-lg border shadow-black p-2 rounded-md"
            >
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid grid-cols-4 mb-6" dir="rtl">
                        <TabsTrigger value="basic">اطلاعات اصلی</TabsTrigger>
                        <TabsTrigger value="inventory">موجودی و قیمت</TabsTrigger>
                        <TabsTrigger value="dimensions">ابعاد و مشخصات</TabsTrigger>
                        <TabsTrigger value="images">تصاویر</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-6" dir="rtl">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>نام محصول</FormLabel>
                                    <FormControl>
                                        <Input placeholder="نام محصول را وارد کنید" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>توضیحات</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="توضیحات محصول را وارد کنید"
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>دسته‌بندی</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                            value={field.value?.toString() || "1"} // Updated to a non-empty string
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="انتخاب دسته‌بندی" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories &&
                                                    categories.map((category) => (
                                                        <SelectItem
                                                            key={category.id}
                                                            value={category.id.toString()}
                                                        >
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="brand_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>برند</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(value ? parseInt(value) : null)
                                            }
                                            value={field.value?.toString() || "1"} // Updated to a non-empty string
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="انتخاب برند" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="default">بدون برند</SelectItem>
                                                {brands &&
                                                    brands.map((brand: Brand) => (
                                                        <SelectItem
                                                            key={brand.id}
                                                            value={brand.id.toString()}
                                                        >
                                                            {brand.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="manufacturer_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>سازنده</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(value ? parseInt(value) : null)
                                            }
                                            value={field.value?.toString() || "default"}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="انتخاب سازنده" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="default">بدون سازنده</SelectItem>
                                                {manufacturers &&
                                                    manufacturers.map((manufacturer: Manufacturer) => (
                                                        <SelectItem
                                                            key={manufacturer.id}
                                                            value={manufacturer.id.toString()}
                                                        >
                                                            {manufacturer.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="warranty_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>گارانتی</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(value ? parseInt(value) : null)
                                            }
                                            value={field.value?.toString() || "default"}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="انتخاب گارانتی" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="default">بدون گارانتی</SelectItem>
                                                {warranties &&
                                                    warranties.map((warranty: Warranty) => (
                                                        <SelectItem
                                                            key={warranty.id}
                                                            value={warranty.id.toString()}
                                                        >
                                                            {warranty.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="inventory" className="space-y-6" dir="rtl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>قیمت (تومان)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="قیمت محصول"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(parseFloat(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>کد کالا (SKU)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="کد کالا را وارد کنید" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>موجودی</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="تعداد موجودی"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(parseInt(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="discount_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>تخفیف</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(value ? parseInt(value) : null)
                                            }
                                            value={field.value?.toString() || "default"}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="انتخاب تخفیف" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="default">بدون تخفیف</SelectItem>
                                                {discounts.map((discount) => (
                                                    <SelectItem
                                                        key={discount.id}
                                                        value={discount.id.toString()}
                                                    >
                                                        {discount.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="min_order_quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>حداقل تعداد سفارش</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="حداقل تعداد سفارش"
                                                value={field.value?.toString() || ""}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value ? parseInt(e.target.value) : null,
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="max_order_quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>حداکثر تعداد سفارش</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="حداکثر تعداد سفارش"
                                                value={field.value?.toString() || ""}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value ? parseInt(e.target.value) : null,
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="featured"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value === true}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>محصول ویژه</FormLabel>
                                            <FormDescription>
                                                این محصول در بخش محصولات ویژه نمایش داده می‌شود
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="on_sale"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value === true}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>حراج</FormLabel>
                                            <FormDescription>
                                                این محصول در بخش حراج نمایش داده می‌شود
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="dimensions" className="space-y-6" dir="rtl">
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>وزن (گرم)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="وزن محصول"
                                            value={field.value?.toString() || ""}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value ? parseFloat(e.target.value) : null,
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="length"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>طول (سانتی‌متر)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="طول محصول"
                                                value={field.value?.toString() || ""}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value ? parseFloat(e.target.value) : null,
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="width"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>عرض (سانتی‌متر)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="عرض محصول"
                                                value={field.value?.toString() || ""}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value ? parseFloat(e.target.value) : null,
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="height"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ارتفاع (سانتی‌متر)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="ارتفاع محصول"
                                                value={field.value?.toString() || ""}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value ? parseFloat(e.target.value) : null,
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="images" className="space-y-6" dir="rtl">
                        <FormItem>
                            <FormLabel>تصویر شاخص</FormLabel>
                            <FormControl>
                                <div className="grid gap-4">
                                    {imagePreview && (
                                        <div className="relative aspect-square w-40 overflow-hidden rounded-lg border">
                                            <img
                                                src={imagePreview || "/placeholder.svg"}
                                                alt="پیش‌نمایش تصویر"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailUpload}
                                        className="cursor-pointer"
                                    />
                                </div>
                            </FormControl>
                            <FormDescription>
                                حداکثر حجم تصویر ۲ مگابایت با فرمت JPG یا PNG
                            </FormDescription>
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>گالری تصاویر</FormLabel>
                                    <FormControl>
                                        <div className="space-y-4">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="آدرس تصویر را وارد کنید"
                                                    value={newImageUrl}
                                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={handleAddImage}
                                                    size="sm"
                                                >
                                                    <Plus className="h-4 w-4 ml-1" />
                                                    افزودن
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {images.map((image, index) => (
                                                    <Card key={index} className="overflow-hidden">
                                                        <div className="relative aspect-square">
                                                            <img
                                                                src={image || "/placeholder.svg"}
                                                                alt={`تصویر ${index + 1}`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute top-2 left-2 h-6 w-6"
                                                                onClick={() => handleRemoveImage(index)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        <CardContent className="p-2">
                                                            <p className="text-xs truncate">{image}</p>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>

                                            {field.value.length === 0 && (
                                                <p className="text-sm text-muted-foreground">
                                                    حداقل یک تصویر برای محصول الزامی است
                                                </p>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>
                </Tabs>

                <div className="flex gap-4 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/dashboard/products")}
                    >
                        انصراف
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        ذخیره تغییرات
                    </Button>
                </div>
            </form>
        </Form>
    );
}
