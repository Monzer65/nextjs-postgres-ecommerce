'use client';
import { Button } from "@/components/ui/button";

export default function CategoryForm({ dropdownData }: { dropdownData: { name: string }) {
  console.log("form submitted")
  return (
    <form>
      <input name="name" type="text" />
      <label>
        enter your name
      </label>
      <Button type="submit">
        submit
      </Button>
    </form>
  )

}
//"use client";
//
//import { useForm } from "react-hook-form";
//import { zodResolver } from "@hookform/resolvers/zod";
//import { createNewCategoryAction } from "./actions";
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
//import { startTransition, useActionState } from "react";
//import { newCategorySchema, NewCategorySchema } from "@/types/zod-schemas/categories";
//import { Loader } from "lucide-react";
//
//type DropdownData = {
//  name: string;
//  // any other necessary fields here
//};
//
//export default function CategoryForm({ dropdownData }: { dropdownData: DropdownData }) {
//  const { toast } = useToast();
//
//  const [state, formAction, isPending] = useActionState(createNewCategoryAction, {
//    message: "",
//    success: false,
//  });
//
//  const form = useForm<NewCategorySchema>({
//    resolver: zodResolver(newCategorySchema),
//    defaultValues: {
//      name: "",
//      description: "",
//      parent_id: undefined,
//    },
//  });
//
//  const onSubmit = (data: NewCategorySchema) => {
//    const formData = new FormData();
//    formData.append("name", data.name);
//    if (data.description) {
//      formData.append("description", data.description);
//    }
//    if (data.parent_id) {
//      formData.append("parent_id", data.parent_id.toString());
//    }
//    startTransition(() => {
//      formAction(formData);
//    });
//
//    console.log("formData", formData);
//  };
//
//  if (state.message) {
//    toast({
//      title: state.success ? "Success" : "Error",
//      description: state.message,
//      variant: state.success ? "default" : "destructive",
//    });
//  }
//
//  return (
//    <Form {...form}>
//      <form
//        action={formAction}
//        onSubmit={form.handleSubmit(onSubmit)}
//        className="space-y-8 max-w-3xl"
//      >
//        {state.message && <p className="p-2 bg-red-100">{state.message}</p>}
//        <FormField
//          control={form.control}
//          name="name"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel>Name</FormLabel>
//              <FormControl>
//                <Input {...field} />
//              </FormControl>
//              <FormDescription>category name</FormDescription>
//              <FormMessage>{form.formState.errors.name?.message}</FormMessage>
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
//              <FormDescription>category description</FormDescription>
//              <FormMessage>{form.formState.errors.description?.message}</FormMessage>
//            </FormItem>
//          )}
//        />
//        <FormField
//          control={form.control}
//          name="parent_id"
//          render={({ field }) => (
//            <FormItem>
//              <FormLabel>parent id</FormLabel>
//              <FormControl>
//                <Input type="number" {...field} />
//              </FormControl>
//              <FormDescription>paren id here</FormDescription>
//              <FormMessage>{form.formState.errors.description?.message}</FormMessage>
//            </FormItem>
//          )}
//        />
//
//        <Button type="submit" className={`${isPending ? "bg-gray-200" : ""}`}>
//          {isPending ? <Loader className="animate-spin w-4 h-4" /> : "create new category"}
//        </Button>
//      </form>
//    </Form>
//  );
//}
//// import {
////   Form,
////   FormControl,
////   FormDescription,
////   FormField,
////   FormItem,
////   FormLabel,
////   FormMessage,
//// } from "@/components/ui/form";
//// import { startTransition, useActionState } from "react";
//// import { createNewCategoryAction } from "./actions";
//// import { Input } from "@/components/ui/input";
//// import { useForm } from "react-hook-form";
//// import { newCategorySchema, NewCategorySchema } from "@/types/zod-schemas/categories";
//// import { zodResolver } from "@hookform/resolvers/zod";
//// import { Button } from "@/components/ui/button";
//// import { Loader } from "lucide-react";
//// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
//
//// export default function LoginSignupForm() {
////   const [state, action, isPending] = useActionState(createNewCategoryAction, {
////     message: "",
////     success: false,
////   });
//
////   const form = useForm<NewCategorySchema>({
////     resolver: zodResolver(newCategorySchema),
////     defaultValues: {
////       name: "",
////     },
////   });
//
////   function onSubmit(values: NewCategorySchema) {
////     const formData = new FormData();
////     formData.append("phone", values.name);
////     startTransition(() => {
////       action(formData);
////     });
////   }
//
////   return (
////     <Form {...form}>
////       <form action={action} onSubmit={form.handleSubmit(onSubmit)}>
////         {state.message && (
////           <Alert variant={"destructive"}>
////             <AlertTitle>خطا</AlertTitle>
////             <AlertDescription>{state.message}</AlertDescription>
////           </Alert>
////         )}
////         <FormField
////           control={form.control}
////           name="name"
////           render={({ field }) => (
////             <FormItem>
////               <FormLabel>name</FormLabel>
////               <FormControl>
////                 <Input {...field} dir="ltr" />
////               </FormControl>
////               <FormDescription>Enter a category name</FormDescription>
////               <FormMessage />
////             </FormItem>
////           )}
////         />
////         <Button
////           type="submit"
////           disabled={isPending}
////           className={`w-full mt-4 bg-pink-500 ${isPending ? "opacity-50" : ""}`}
////         >
////           {isPending && <Loader className="w-6 h-6 animate-spin" />}
////           create
////         </Button>
////       </form>
////     </Form>
////   );
//// }
