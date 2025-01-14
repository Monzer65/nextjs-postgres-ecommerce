"use client";

import { useActionState } from "react";
import { Loader, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/logout";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const initialState = {
  message: "",
};

interface LogoutButtonProps {
  className?: string;
  formClassName?: string;
  buttonClassName?: string;
  iconClassName?: string;
  textClassName?: string;
  alertClassName?: string;
}

export function LogoutButton({
  className,
  formClassName,
  buttonClassName,
  iconClassName,
  textClassName,
  alertClassName,
}: LogoutButtonProps) {
  const [state, action, isPending] = useActionState(logoutAction, initialState);

  return (
    <form action={action} className={cn("w-full", formClassName, className)}>
      <Button
        variant="ghost"
        disabled={isPending}
        className={cn(
          "flex items-center w-full gap-2",
          isPending && "opacity-50",
          buttonClassName
        )}
      >
        {isPending ? (
          <Loader className={cn("h-4 w-4 animate-spin", iconClassName)} />
        ) : (
          <LogOut className={cn("h-4 w-4", iconClassName)} />
        )}
        <span className={textClassName}>خروج</span>
      </Button>
      {state.message && (
        <Alert variant="destructive" className={`${alertClassName} mt-2`}>
          <AlertTitle>خطا</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
