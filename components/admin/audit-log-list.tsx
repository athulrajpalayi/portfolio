import { GlassCard } from "@/components/primitives/glass-card";
import type { AuditEvent } from "@/lib/security/audit";

type AuditLogListProps = {
  events: AuditEvent[];
};

export function AuditLogList({ events }: AuditLogListProps) {
  return (
    <GlassCard className="rounded-[28px] p-6">
      <div className="text-lg font-semibold text-[var(--text-primary)]">Audit and Security</div>
      <div className="mt-5 grid gap-4">
        {events.map((event) => (
          <div
            key={`${event.title}-${event.occurredAt}`}
            className="rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-medium text-[var(--text-primary)]">{event.title}</div>
              <div className="text-xs uppercase tracking-[0.28em] text-[var(--text-muted)]">
                {event.status}
              </div>
            </div>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{event.detail}</p>
            <div className="mt-2 text-xs text-[var(--text-muted)]">{event.occurredAt}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
