import type { ReactNode } from "react";

import { GlassCard } from "@/components/primitives/glass-card";

type EditorPanelProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function EditorPanel({ title, description, children }: EditorPanelProps) {
  return (
    <GlassCard className="rounded-[28px] p-6">
      <div className="text-lg font-semibold text-[var(--text-primary)]">{title}</div>
      {description ? (
        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{description}</p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </GlassCard>
  );
}
