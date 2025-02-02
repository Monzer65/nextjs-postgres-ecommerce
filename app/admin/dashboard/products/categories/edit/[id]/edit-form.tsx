"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { startTransition, useActionState } from "react";
import { updateCategoryAction } from "./actions";
import { updateCategorySchema } from "@/types/zod-schemas/categories";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, RefreshCw, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Category {
  id: number;
  name: string;
  description: string | null;
  parent_id: number | null;
}

interface State {
  message: string;
  success: boolean;
}

export default function EditCategoryForm({
  category,
  categories,
}: {
  category: Category;
  categories: Category[];
}) {
  const initialState: State = { message: "", success: false };
  const updateCategoryWithId = updateCategoryAction.bind(
    null,
    category.id.toString(),
  );
  const [state, formAction, isPending] = useActionState(
    updateCategoryWithId,
    initialState,
  );

  const form = useForm<z.infer<typeof updateCategorySchema>>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      id: category.id,
      name: category.name,
      description: category.description || "",
      parent_id: category.parent_id || undefined,
    },
  });
  function onSubmit(values: z.infer<typeof updateCategorySchema>) {
    const formData = new FormData();
    formData.append("id", values.id.toString());
    if (values.name) {
      formData.append("name", values.name);
    }
    if (values.description) {
      formData.append("description", values.description);
    }
    if (values.parent_id) {
      formData.append("parent_id", values.parent_id.toString());
    }

    startTransition(() => {
      formAction(formData);
    });
  }
  return (
    <Form {...form}>
      <form
        action={formAction}
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl mx-auto space-y-8 border p-2 rounded-lg"
      >
        {state.success === false && state.message && (
          <Alert variant="destructive">
            <AlertTitle>خطا</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>اسم دسته بندی را تعیین کنید</FormDescription>
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
                <Textarea className="resize-vertical" {...field} />
              </FormControl>
              <FormDescription>
                توضیحات مختصر درباره دسته بندی (اختیاری)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parent_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>دسته بندی مادر</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(
                    value === "none" ? undefined : Number.parseInt(value),
                  )
                }
                defaultValue={
                  field.value === undefined ? "none" : field.value?.toString()
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="یک دسته‌بندی مادر را انتخاب کنید" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories
                    .filter((cat) => cat.id !== category.id) // Exclude the current category
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormDescription>
                نزدیکترین دسته بندی مادر را انتخاب کنید (اختیاری)
              </FormDescription>
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
