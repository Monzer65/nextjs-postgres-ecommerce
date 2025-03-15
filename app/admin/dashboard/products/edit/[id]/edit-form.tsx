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
import { ArrowDown, ArrowUp, Loader2, Star, Trash2 } from "lucide-react";

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
import { updateProductAction } from "./actions";
import {
  productEditSchema,
  type ProductEditFormData,
  prepareProductEditData,
} from "@/types/zod-schemas/products";
import { useQuery } from "@tanstack/react-query";
import {
  Brand,
  Category,
  Manufacturer,
  Product,
  ProductImage,
  Warranty,
} from "@/db/schema";
import { UploadedImages } from "../../add/form";
import ImageUpload from "../../add/image-upload";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const discounts = [
  { id: 1, name: "تخفیف ۱۰٪" },
  { id: 2, name: "تخفیف ۲۰٪" },
  { id: 3, name: "تخفیف ویژه" },
];

export interface Image {
  type: "existing" | "upload";
  url: string;
  is_primary: boolean;
  order: number;
  id?: number;
  alt_text?: string | null;
  public_id?: string;
  thumbnail_url?: string;
  bytes?: number;
  height?: number;
  width?: number;
}

export function ProductEditForm({ product }: { product: Product }) {
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

  const { data: imagesData } = useQuery<ProductImage[]>({
    queryKey: ["product_images", product.id], // Add product.id to key for caching
    queryFn: async () => {
      const response = await fetch(`/api/images/${product.id}`);
      if (!response.ok) throw new Error("Failed to fetch images");
      return response.json();
    },
  });

  const [images, setImages] = useState<Image[]>([]);
  const originalImagesRef = useRef<Array<Image>>([]);

  // Ref to store positions before reordering
  const positionsRef = useRef<Map<string, DOMRect>>(new Map());
  // State to track which items are animating
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());

  const router = useRouter();

  // Initialize the form with default values from the product
  const form = useForm<ProductEditFormData>({
    resolver: zodResolver(productEditSchema),
    defaultValues: prepareProductEditData(product),
  });

  useEffect(() => {
    if (imagesData) {
      const initialImages = imagesData.map((img) => ({
        type: "existing" as const,
        url: img.url,
        alt_text: img.alt_text,
        order: img.order,
        is_primary: img.is_primary,
        id: img.id,
        public_id: undefined,
      }));

      setImages(initialImages);
      originalImagesRef.current = initialImages;
    }
  }, [imagesData]);

  const handleUploadSuccess = (fileInfo: UploadedImages) => {
    console.log("handleUploadSuccess called", fileInfo); // Debugging
    setImages((prev) => {
      console.log("prev", prev); // Debugging
      const exists = prev.some((img) => img.public_id === fileInfo.public_id);
      console.log("exists", exists); // Debugging
      if (exists) {
        console.log("Image already exists"); // Debugging
        return prev;
      }
      return [
        ...prev,
        {
          type: "upload" as const,
          url: fileInfo.secure_url,
          alt_text: "",
          order: prev.length,
          is_primary: false,
          id: undefined,
          public_id: fileInfo.public_id,
        },
      ];
    });
  };

  //useEffect(() => {
  //  console.log("Updated images state:", images); // Debugging
  //}, [images]);
  //
  //const moveImage = (oldIndex: number, newIndex: number) => {
  //  if (oldIndex === newIndex) return;
  //
  //  setImages((prev) => {
  //    const newImages = [...prev];
  //    const [movedItem] = newImages.splice(oldIndex, 1);
  //    newImages.splice(newIndex, 0, movedItem);
  //
  //    // Update order for all items
  //    return newImages.map((img, index) => ({
  //      ...img,
  //      order: index,
  //    }));
  //  });
  //};
  //
  // Function to move an image with animation
  const moveImage = (oldIndex: number, newIndex: number) => {
    if (oldIndex === newIndex) return;

    // Store current positions before reordering
    const itemsMap = new Map<string, DOMRect>();
    images.forEach((img) => {
      const key = img.id || img.public_id || `img-${img.order}`;
      const element = document.getElementById(`image-item-${key}`);
      if (element) {
        itemsMap.set(key as string, element.getBoundingClientRect());
      }
    });
    positionsRef.current = itemsMap;

    // Create new array with reordered items
    const newImages = [...images];
    const [movedItem] = newImages.splice(oldIndex, 1);
    newImages.splice(newIndex, 0, movedItem);

    // Update order for all items
    const updatedImages = newImages.map((img, index) => ({
      ...img,
      order: index,
    }));

    // Mark items that need animation
    const animatingSet = new Set<string>();
    for (
      let i = Math.min(oldIndex, newIndex);
      i <= Math.max(oldIndex, newIndex);
      i++
    ) {
      const key =
        updatedImages[i].id ||
        updatedImages[i].public_id ||
        `img-${updatedImages[i].order}`;
      animatingSet.add(key as string);
    }
    setAnimatingItems(animatingSet);

    // Update the images
    setImages(updatedImages);
  };

  // Apply FLIP animation after DOM update
  useEffect(() => {
    if (animatingItems.size === 0) return;

    // Schedule animation after render
    requestAnimationFrame(() => {
      // For each animating item, apply FLIP technique
      animatingItems.forEach((key) => {
        const element = document.getElementById(`image-item-${key}`);
        if (!element) return;

        const oldPosition = positionsRef.current.get(key);
        if (!oldPosition) return;

        const newPosition = element.getBoundingClientRect();

        // Calculate the difference
        const deltaY = oldPosition.top - newPosition.top;

        // First: set to old position instantly
        element.style.transform = `translateY(${deltaY}px)`;
        element.style.transition = "none";

        // Last & Play: animate to new position
        requestAnimationFrame(() => {
          element.style.transition = "transform 300ms ease-out";
          element.style.transform = "translateY(0)";
        });
      });

      // Clear animating items after animation completes
      const timer = setTimeout(() => {
        setAnimatingItems(new Set());
      }, 300);

      return () => clearTimeout(timer);
    });
  }, [images, animatingItems]);

  // Unified remove function
  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  //const handleSetPrimary = (targetImage: Image, checked: boolean) => {
  //  const updated = images.map((img) => ({
  //    ...img,
  //    is_primary: img.url === targetImage.url ? checked : false,
  //  }));
  //  const updatedPrimary = updated.filter((img) => "id" in img);
  //
  //  setImages(updatedPrimary);
  //};
  // Update the handleSetPrimary function in your ProductImageList component
  const handleSetPrimary = (targetImage: Image, checked: boolean) => {
    if (!checked) {
      // If unchecking, just update is_primary flag
      const updated = images.map((img) => ({
        ...img,
        is_primary: false // No primary image if current one is unchecked
      }));
      setImages(updated);
      return;
    }

    // First, create a copy of the images array
    let updated = [...images];

    // Find the index of the target image
    const targetIndex = updated.findIndex(img =>
      (img.id && img.id === targetImage.id) ||
      (img.public_id && img.public_id === targetImage.public_id) ||
      img.url === targetImage.url
    );

    if (targetIndex === -1) return;

    // Remove the target image from its current position
    const [movedImage] = updated.splice(targetIndex, 1);

    // Update it to be primary
    movedImage.is_primary = true;

    // Insert it at the beginning (first position)
    updated.unshift(movedImage);

    // Make sure all other images are not primary
    updated = updated.map((img, index) => ({
      ...img,
      is_primary: index === 0, // Only the first image is primary
      order: index // Update order for all images
    }));

    // Update the state with the new order
    setImages(updated);
  };

  // Update form values whenever images change
  useEffect(() => {
    const formImages = images.map((img, index) => ({
      type: img.type as "upload" | "existing",
      url: img.url,
      alt_text: img.alt_text || "",
      order: index,
      is_primary: img.is_primary || false,
      id: img.id || undefined,
      public_id: img.public_id || undefined,
    }));

    form.setValue("images", formImages);
  }, [images, form]);

  //// Add drag and drop handlers
  //const handleDragStart = (e: React.DragEvent, index: number) => {
  //  e.dataTransfer.setData("index", index.toString());
  //};
  //
  //const handleDrop = (e: React.DragEvent, newIndex: number) => {
  //  e.preventDefault();
  //  const oldIndex = parseInt(e.dataTransfer.getData("index"));
  //  if (oldIndex === newIndex) return;
  //
  //  setExistingImages((prev) => {
  //    const newImages = [...prev];
  //    const [moved] = newImages.splice(oldIndex, 1);
  //    newImages.splice(newIndex, 0, moved);
  //    return newImages.map((img, idx) => ({ ...img, order: idx }));
  //  });
  //};
  //
  // Update alt text
  const handleAltTextChange = (targetImage: Image, newAltText: string) => {
    if (targetImage.id) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === targetImage.id ? { ...img, alt_text: newAltText } : img,
        ),
      );
    } else {
      setImages((prev) =>
        prev.map((img) =>
          img.public_id === targetImage.public_id
            ? { ...img, alt_text: newAltText }
            : img,
        ),
      );
    }
  };

  const onSubmit = async (data: ProductEditFormData) => {
    // Create FormData
    const formData = new FormData();

    // Handle each form field appropriately
    Object.entries(data).forEach(([key, value]) => {
      if (key === "images") {
        const processedImages = images.map((img) => ({
          type: img.type,
          url: img.url,
          alt_text: img.alt_text || "", // Ensure alt_text is a string
          order: img.order,
          is_primary: img.is_primary,
          id: img.id || undefined, // Existing images have id, new ones don't
          public_id: img.public_id || undefined, // Uploaded images have public_id
        }));

        formData.append("images", JSON.stringify(processedImages));

        // Debug: Log the processed images
        console.log("Processed images for submission:", processedImages);
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
        {state.success === false && state.message && (
          <Alert variant="destructive">
            <AlertTitle>خطا</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

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
                          categories.map((category: Category) => (
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
            <div className="mb-6">
              <ImageUpload onUploadSuccess={handleUploadSuccess} />
            </div>

            {/* Improved Images Display */}
            {images.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">تصاویر محصول</h3>
                <div className="grid gap-4">
                  {images.map((image, index) => {
                    const key =
                      image.id || image.public_id || `img-${image.order}`;
                    return (
                      <div
                        key={key}
                        id={`image-item-${key}`}
                        className="transition-opacity duration-300"
                        style={{
                          willChange: "transform",
                          position: "relative",
                        }}
                      >
                        <Card className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row">
                              {/* Image Preview */}
                              <div className="relative w-full sm:w-1/3">
                                <img
                                  src={image.url || "/placeholder.svg"}
                                  alt={image.alt_text || "تصویر محصول"}
                                  className="h-40 w-full object-cover"
                                />
                                {image.is_primary && (
                                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                    <Star className="h-4 w-4 fill-current" />
                                  </div>
                                )}
                              </div>

                              {/* Controls */}
                              <div className="p-4 w-full sm:w-2/3 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() =>
                                        moveImage(index, index - 1)
                                      }
                                      disabled={index === 0}
                                      className="h-8 w-8"
                                    >
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() =>
                                        moveImage(index, index + 1)
                                      }
                                      disabled={index === images.length - 1}
                                      className="h-8 w-8"
                                    >
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                      {index + 1} از {images.length}
                                    </span>
                                  </div>

                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleRemoveImage(index)}
                                    className="h-8 w-8"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    توضیحات تصویر (Alt Text)
                                  </label>
                                  <Input
                                    value={image.alt_text || ""}
                                    onChange={(e) =>
                                      handleAltTextChange(image, e.target.value)
                                    }
                                    placeholder="توضیحات تصویر"
                                    className="text-right"
                                  />
                                </div>

                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    id={`primary-${image.id || index}`}
                                    checked={image.is_primary}
                                    onCheckedChange={(checked) =>
                                      handleSetPrimary(
                                        image,
                                        checked as boolean,
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`primary-${image.id || index}`}
                                    className="text-sm font-medium cursor-pointer"
                                  >
                                    تصویر اصلی
                                  </label>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                هیچ تصویری بارگذاری نشده است
              </div>
            )}
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
