"use client";
import { brandSchema, BrandSchemaType } from "@/types/zod-schemas/products";
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
import { Brand } from "@/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronsUpDown, Loader, Save } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { startTransition, useActionState, useState } from "react";

import { createNewBrand } from "./actions";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function BrandForm() {
  const router = useRouter();
  const form = useForm<BrandSchemaType>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [state, formAction, isPending] = useActionState(createNewBrand, {
    message: "",
    success: false,
  });

  const onSubmit = (data: BrandSchemaType) => {
    console.log(data);
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) {
      formData.append("description", data.description);
    }
    startTransition(() => {
      formAction(formData);
    });
  };
  return (
    <Form {...form}>
      <form action={formAction} onSubmit={form.handleSubmit(onSubmit)}>
        {state.message && (
          <Alert variant={state.success ? "default" : "destructive"}>
            <AlertTitle>{state.success ? "موفق" : "خطا"}</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>*نام برند</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>نام برند را وارد کنید</FormDescription>
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
                  placeholder=""
                  {...field}
                  value={field.value || ""} // Ensure it's always a string
                  onChange={(e) => field.onChange(e.target.value)} // Use value instead of toString()
                />
              </FormControl>
              <FormDescription>
                توضیحات درباره برند را وارد کنید
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader className="w-4 h-4  animate-spin" />
          ) : (
            <Save className="w-4 h-4 " />
          )}
          {isPending ? "درحال ذخیره..." : "ذخیره"}
        </Button>
      </form>
    </Form>
  );
}
