import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type GlassCardProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  spotlight?: boolean;
} & HTMLAttributes<HTMLElement>;

export function GlassCard<T extends ElementType = "div">({
  as,
  children,
  className,
  spotlight = false,
  ...props
}: GlassCardProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "glass-surface relative overflow-hidden rounded-[28px] p-6",
        spotlight && "before:absolute before:inset-x-10 before:top-0 before:h-32 before:bg-[radial-gradient(circle,rgba(40,240,211,0.18),transparent_72%)] before:blur-2xl before:content-['']",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
