"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { startTransition, useActionState } from "react";
import { verifyAction } from "./actions";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { verifySchema, VerifySchema } from "@/types/zod-schemas/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function VerifyForm() {
  const [state, action, isPending] = useActionState(verifyAction, {
    message: "",
    success: false,
  });

  const form = useForm<VerifySchema>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(values: VerifySchema) {
    const formData = new FormData();
    formData.append("code", values.code);
    startTransition(() => {
      action(formData);
    });
  }

  return (
    <Form {...form}>
      <form action={action} onSubmit={form.handleSubmit(onSubmit)}>
        {state.message && (
          <Alert variant={"destructive"}>
            <AlertTitle>خطا</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>کد</FormLabel>
              <FormControl>
                <Input {...field} dir="ltr" />
              </FormControl>
              <FormDescription>
                کد 6 رقمی ارسال شده به شماره تلفن خود را وارد کنید
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending}
          className={`w-full mt-4 bg-pink-500 ${isPending ? "opacity-50" : ""}`}
        >
          {isPending && <Loader className="w-6 h-6 animate-spin" />}
          ارسال
        </Button>
      </form>
    </Form>
  );
}
