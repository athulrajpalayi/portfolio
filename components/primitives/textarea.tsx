import * as React from "react";

import { cn } from "@/lib/utils/cn";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-36 w-full rounded-[24px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.05)] px-4 py-4 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-[rgba(59,130,246,0.34)] focus:bg-[rgba(255,255,255,0.08)] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
