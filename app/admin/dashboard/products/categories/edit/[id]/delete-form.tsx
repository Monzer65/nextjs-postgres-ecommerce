import { Loader, TrashIcon } from "lucide-react";
import { deleteCategoryAction } from "../../add/actions";
import { useActionState } from "react";
import { cn } from "@/lib/utils";

export function DeleteCategory({ id }: { id: string }) {
  const [_, deleteCategoryWithId, isPending] = useActionState(
    deleteCategoryAction.bind(null, id),
    null,
  );

  return (
    <form action={deleteCategoryWithId} className="w-full">
      <button
        type="submit"
        className={cn(
          "flex items-center w-full gap-2 p-2",
          isPending && "opacity-50",
        )}
        disabled={isPending}
      >
        {isPending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <TrashIcon className="w-4" />
        )}

        <span>حذف</span>
      </button>
    </form>
  );
}
