import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
  "group inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(40,240,211,0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-[image:var(--gradient-primary)] text-slate-950 shadow-[var(--shadow-glow)] hover:-translate-y-0.5 hover:shadow-[0_20px_80px_rgba(40,240,211,0.18)]",
        secondary:
          "glass-surface text-[var(--text-primary)] hover:-translate-y-0.5 hover:border-[rgba(40,240,211,0.22)] hover:bg-[rgba(255,255,255,0.09)]",
        ghost:
          "border border-[var(--border-subtle)] bg-transparent text-[var(--text-secondary)] hover:border-[rgba(59,130,246,0.26)] hover:text-[var(--text-primary)]",
        admin:
          "border border-[rgba(59,130,246,0.24)] bg-[rgba(59,130,246,0.14)] text-[var(--text-primary)] hover:border-[rgba(40,240,211,0.34)] hover:bg-[rgba(40,240,211,0.14)]"
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
