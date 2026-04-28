import { cn } from "@/lib/utils/cn";

type SignalLineProps = {
  orientation?: "horizontal" | "vertical";
  className?: string;
};

export function SignalLine({
  orientation = "horizontal",
  className
}: SignalLineProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "signal-track rounded-full bg-[rgba(255,255,255,0.06)]",
        orientation === "horizontal" ? "h-px flex-1 min-w-10" : "w-px min-h-10",
        className
      )}
    />
  );
}
