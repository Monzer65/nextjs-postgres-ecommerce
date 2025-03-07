import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditPage() {
  return (
    <main className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-2">
      <div className="w-10 text-muted-foreground" />
      <h2 className="text-3xl font-semibold">404 یافت نشد</h2>
      <p className="text-muted-foreground">هیچ محصولی انتخاب نکرده‌اید</p>
      <Button asChild className="mt-4">
        <Link href="/admin/dashboard/products">بازگشت به لیست محصولات </Link>
      </Button>
    </main>
  );
}
