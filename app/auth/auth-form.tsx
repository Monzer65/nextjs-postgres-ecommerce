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
import { loginSignupAction } from "./actions";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { loginSignupSchema, LoginSignupSchema } from "@/types/zod-schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginSignupForm() {
  const [state, action, isPending] = useActionState(loginSignupAction, {
    message: "",
    success: false,
  });

  const form = useForm<LoginSignupSchema>({
    resolver: zodResolver(loginSignupSchema),
    defaultValues: {
      phone: "",
    },
  });

  function onSubmit(values: LoginSignupSchema) {
    const formData = new FormData();
    formData.append("phone", values.phone);
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تلفن</FormLabel>
              <FormControl>
                <Input {...field} dir="ltr" />
              </FormControl>
              <FormDescription>
                شماره تلفن خود را وارد کنید تا کد تایید برای شما ارسال شود
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
          ادامه
        </Button>
      </form>
    </Form>
  );
}
