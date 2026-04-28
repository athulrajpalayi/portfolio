import type { CaseStudyStep } from "@/lib/content/site-content";

type CaseStudyTimelineProps = {
  steps: CaseStudyStep[];
};

export function CaseStudyTimeline({ steps }: CaseStudyTimelineProps) {
  return (
    <div className="grid gap-4">
      {steps.map((step, index) => (
        <div
          key={step.title}
          className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-5"
        >
          <div className="text-xs uppercase tracking-[0.32em] text-[var(--accent-teal)]">
            Phase {index + 1}
          </div>
          <div className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{step.title}</div>
          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{step.detail}</p>
        </div>
      ))}
    </div>
  );
}
