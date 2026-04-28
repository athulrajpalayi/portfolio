import * as React from "react";

import { cn } from "@/lib/utils/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-2xl border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.05)] px-4 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-[rgba(40,240,211,0.36)] focus:bg-[rgba(255,255,255,0.08)] focus:shadow-[0_0_0_4px_rgba(40,240,211,0.08)]",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
