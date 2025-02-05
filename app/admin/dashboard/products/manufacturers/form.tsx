"use client";
import {
  manufacturerSchema,
  ManufacturerSchemaType,
} from "@/types/zod-schemas/manufacturers";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader, Save } from "lucide-react";
import { startTransition, useActionState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createNewManufacturer } from "./actions";

export function ManufacturerForm() {
  const form = useForm<ManufacturerSchemaType>({
    resolver: zodResolver(manufacturerSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [state, formAction, isPending] = useActionState(createNewManufacturer, {
    message: "",
    success: false,
  });

  const onSubmit = (data: ManufacturerSchemaType) => {
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
      <form
        action={formAction}
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid space-y-4"
      >
        {state.message && (
          <Alert variant={state.success ? "default" : "destructive"}>
            <AlertTitle>{state.success ? "موفق" : "خطا"}</AlertTitle>
            <AlertDescription
              className={`${state.success && "text-green-400"}`}
            >
              {state.message}
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>*نام تولیدکننده</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>نام تولیدکننده را وارد کنید</FormDescription>
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
                توضیحات درباره تولیدکننده را وارد کنید
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="mt-8">
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
