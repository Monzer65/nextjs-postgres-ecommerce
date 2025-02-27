"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useActionState } from "react";
import { deleteProduct } from "./actions";

function DeleteButton() {
  return (
    <AlertDialogAction
      type="submit"
      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
    >
      حذف محصول
    </AlertDialogAction>
  );
}

export function DeleteProduct({ id }: { id: number }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteProductWithId = deleteProduct.bind(null, id);
  const [state, formAction, isLoading] = useActionState(deleteProductWithId, {
    message: "",
    error: null,
  });

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => setShowDeleteDialog(true)}
      >
        <span className="sr-only">Delete product</span>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              آیا از حذف این محصول اطمینان دارید؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              این عملیات غیرقابل بازگشت است. پس از حذف، محصول به طور کامل از
              سیستم حذف خواهد شد.
              {state?.error && (
                <p className="mt-2 text-sm text-destructive">{state.error}</p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <form action={formAction}>
              <DeleteButton />
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
