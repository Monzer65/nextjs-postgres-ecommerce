"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
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
import {
  productEditSchema,
  type ProductEditFormData,
  prepareProductEditData,
} from "@/types/zod-schemas/products";
import { useQuery } from "@tanstack/react-query";
import { Brand, Manufacturer, ProductImage, Warranty } from "@/db/schema";
import { CldImage } from "next-cloudinary";
import { UploadedImages } from "../../add/form";
import ImageUpload from "../../add/image-upload";
import Image from "next/image";
import { toast } from "sonner";

const discounts = [
  { id: 1, name: "تخفیف ۱۰٪" },
  { id: 2, name: "تخفیف ۲۰٪" },
  { id: 3, name: "تخفیف ویژه" },
];

export function ProductEditForm({ product }: { product: any }) {
  const { data: categories } = useQuery({
    queryKey: ["categoriesData"],
    queryFn: async () => {
      const response = await fetch(`/api/categories`);
      return response.json();
    },
  });

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

  const { data: imagesData } = useQuery<Partial<ProductImage>[]>({
    queryKey: ["product_images", product.id], // Add product.id to key for caching
    queryFn: async () => {
      const response = await fetch(`/api/images/${product.id}`);
      if (!response.ok) throw new Error("Failed to fetch images");
      return response.json();
    },
  });

  const originalImagesRef = useRef<Partial<ProductImage>[]>(imagesData || []);
  const [uploadedImages, setUploadedImages] = useState<UploadedImages[]>([]);

  // Initialize with empty array - the useEffect will populate it
  const [existingImages, setExistingImages] = useState<Partial<ProductImage>[]>(
    [],
  );

  const router = useRouter();

  // Initialize the form with default values from the product
  const form = useForm<ProductEditFormData>({
    resolver: zodResolver(productEditSchema),
    defaultValues: prepareProductEditData(product),
  });

  // Replace the existing useEffect for existingImages with this
  useEffect(() => {
    if (imagesData) {
      setExistingImages(imagesData);
      originalImagesRef.current = imagesData; // Update the ref with fetched data
    }
  }, [imagesData]); // Trigger when imagesData changes

  const getMergedImages = (): Array<ProductImage | UploadedImages> => {
    const existing = existingImages.map((img) => ({
      url: img.url!,
      alt_text: img.alt_text || "",
      order: img.order || 0,
      is_primary: img.is_primary || false,
      id: img.id, // For existing images
    }));

    const uploaded = uploadedImages.map((img, index) => ({
      url: img.url!,
      alt_text: img.alt_text || "",
      order: existing.length + index, // Initial order after existing
      is_primary: false,
      public_id: img.public_id, // For new uploads
    }));

    return [...existing, ...uploaded];
  };

  // Update useEffect to set form value
  useEffect(() => {
    const mergedImages = getMergedImages();
    form.setValue("images", mergedImages);
  }, [uploadedImages, existingImages]);

  // Move images in the merged array
  const moveImage = (index: number, direction: "up" | "down") => {
    const merged = getMergedImages();
    const newIndex = direction === "up" ? index - 1 : index + 1;

    // Swap positions
    [merged[index], merged[newIndex]] = [merged[newIndex], merged[index]];

    // Update order properties based on new positions
    const updated = merged.map((img, idx) => ({ ...img, order: idx }));

    // Split back into existing and uploaded
    const updatedExisting = updated.filter((img) => "id" in img);
    const updatedUploaded = updated.filter((img) => "public_id" in img);

    setExistingImages(updatedExisting);
    setUploadedImages(updatedUploaded);
  };

  // Add to your component state
  const [imageOrder, setImageOrder] = useState<string[]>([]);

  // Add drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("index", index.toString());
  };

  const handleDrop = (e: React.DragEvent, newIndex: number) => {
    e.preventDefault();
    const oldIndex = parseInt(e.dataTransfer.getData("index"));
    if (oldIndex === newIndex) return;

    setExistingImages((prev) => {
      const newImages = [...prev];
      const [moved] = newImages.splice(oldIndex, 1);
      newImages.splice(newIndex, 0, moved);
      return newImages.map((img, idx) => ({ ...img, order: idx }));
    });
  };

  // Set primary image
  const handleSetPrimary = (
    targetImage: ProductImage | UploadedImages,
    checked: boolean,
  ) => {
    const updated = getMergedImages().map((img) => ({
      ...img,
      is_primary: img.url === targetImage.url ? checked : false,
    }));

    // Update state
    const updatedExisting = updated.filter((img) => "id" in img);
    const updatedUploaded = updated.filter((img) => "public_id" in img);

    setExistingImages(updatedExisting);
    setUploadedImages(updatedUploaded);
  };

  // Update alt text
  const handleAltTextChange = (
    targetImage: ProductImage | UploadedImages,
    newAltText: string,
  ) => {
    if ("id" in targetImage) {
      setExistingImages((prev) =>
        prev.map((img) =>
          img.id === targetImage.id ? { ...img, alt_text: newAltText } : img,
        ),
      );
    } else {
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.public_id === targetImage.public_id
            ? { ...img, alt_text: newAltText }
            : img,
        ),
      );
    }
  };
  //const getMergedImageUrls = (): string[] => {
  //  const uniqueUrls = new Set<string>();
  //
  //  // Add existing image URLs
  //  existingImages.forEach((img) => {
  //    if (img.url) uniqueUrls.add(img.url);
  //  });
  //
  //  // Add uploaded image URLs
  //  uploadedImages.forEach((img) => {
  //    if (img.url) uniqueUrls.add(img.url);
  //  });
  //
  //  return Array.from(uniqueUrls);
  //};
  //
  //useEffect(() => {
  //  const mergedImageUrls = getMergedImageUrls();
  //  form.setValue("images", mergedImageUrls);
  //}, [uploadedImages, existingImages]);

  const handleUploadSuccess = (fileInfo: UploadedImages) => {
    setUploadedImages((prev) => {
      // Check against both uploaded AND existing images
      const existsInUploaded = prev.some(
        (img) => img.public_id === fileInfo.public_id,
      );
      const existsInExisting = existingImages.some(
        (img) => img.url === fileInfo.url,
      );

      if (existsInUploaded || existsInExisting) {
        toast("این تصویر قبلاً اضافه شده است");
        return prev;
      }
      return [...prev, fileInfo];
    });
  };

  // Callback function to handle file removal
  const handleRemoveImageFromUploadedImages = (publicId: string) => {
    setUploadedImages((prev) =>
      prev.filter((file) => file.public_id !== publicId),
    );
  };

  const handleremoveImageFromExistingImages = (imageId: number) => {
    setExistingImages((prevImages) =>
      prevImages.filter((img) => img.id !== imageId),
    );
  };

  // Reset images to the original state from ref
  const resetImages = () => {
    setExistingImages([...originalImagesRef.current]);
  };

  const onSubmit = async (data: ProductEditFormData) => {
    // Create FormData
    const formData = new FormData();

    // Handle each form field appropriately
    Object.entries(data).forEach(([key, value]) => {
      if (key === "images") {
        // Stringify the array of image objects
        formData.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        // Handle other arrays (if any exist)
        value.forEach((val) => {
          formData.append(key, val.toString());
        });
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (typeof value === "number") {
        formData.append(key, value.toString());
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "true" : "false");
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Debug: Log the actual data
    toast(
      <pre
        dir="ltr"
        className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto"
      >
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>,
    );

    // Verify FormData contents
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
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
            <ImageUpload onUploadSuccess={handleUploadSuccess} />

            {/* Combined Images Display */}
            <div className="space-y-4">
              {getMergedImages().map((image, index) => (
                <div
                  key={image.id || image.public_id}
                  className="flex items-center gap-4 relative group"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  {/* Reorder Buttons */}
                  <Button
                    type="button"
                    onClick={() => moveImage(index, "up")}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    onClick={() => moveImage(index, "down")}
                    disabled={index === uploadedImages.length - 1}
                  >
                    ↓
                  </Button>

                  {/* Image Preview */}
                  <img
                    src={image.url}
                    alt={image.alt_text}
                    className="h-20 w-20 object-cover"
                  />

                  {/* Alt Text Input */}
                  <Input
                    value={image.alt_text}
                    onChange={(e) => handleAltTextChange(image, e.target.value)}
                    placeholder="Alt text"
                  />

                  {/* Primary Checkbox */}
                  <Checkbox
                    checked={image.is_primary}
                    onCheckedChange={(checked) =>
                      handleSetPrimary(image, checked)
                    }
                  />
                  <p>Primary</p>

                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveImage(image)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
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
          //
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            ذخیره تغییرات
          </Button>
        </div>
      </form>
    </Form>
  );
}
