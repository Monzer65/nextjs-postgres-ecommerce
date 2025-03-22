"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedText({ children, className }: AnimatedTextProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="animate-color-wave relative inline-block">{children}</div>
    </div>
  );
}
