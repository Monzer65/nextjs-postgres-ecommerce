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
import { WarrantyForm } from "../../warranties/form";
export default function WarrantyModal() {
  const router = useRouter();

  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogTrigger asChild>
        <Button variant="outline">ضمانت جدید</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ضمانت جدید</DialogTitle>
          <DialogDescription>
            با پر کردن فرم زیر یک ضمانت جدید ایجاد کنید
          </DialogDescription>
        </DialogHeader>
        <div>
          <WarrantyForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
