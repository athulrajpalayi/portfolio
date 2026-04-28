import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type SectionHeaderProps = {
  label: string;
  title: string;
  description: string;
  align?: "left" | "center";
  action?: ReactNode;
};

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
  action
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center"
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        <div className="eyebrow mb-4">{label}</div>
        <h2 className="text-4xl font-bold tracking-[-0.04em] text-[var(--text-primary)] md:text-5xl">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--text-secondary)] md:text-lg">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
