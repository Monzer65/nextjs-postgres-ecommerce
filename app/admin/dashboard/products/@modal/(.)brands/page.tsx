"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { BrandForm } from "../../brands/form";
export default function BrandsModal() {
  const router = useRouter();

  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogTrigger asChild>
        <Button variant="outline">برند جدید</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>برند جدید</DialogTitle>
          <DialogDescription>
            با پر کردن فرم زیر یک برند جدید ایجاد کنید
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <BrandForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
