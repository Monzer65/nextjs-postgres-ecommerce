"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  //DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { ManufacturerForm } from "../../manufacturers/form";
export default function ManufacturersModal() {
  const router = useRouter();

  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogTrigger asChild>
        <Button variant="outline">تولیدکننده جدید</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تولیدکننده جدید</DialogTitle>
          <DialogDescription>
            با پر کردن فرم زیر یک تولیدکننده جدید ایجاد کنید
          </DialogDescription>
        </DialogHeader>
        <div>
          <ManufacturerForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
