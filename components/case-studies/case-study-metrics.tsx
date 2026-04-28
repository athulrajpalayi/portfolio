import type { FeaturedProject } from "@/lib/content/site-content";

type CaseStudyMetricsProps = {
  project: FeaturedProject;
};

export function CaseStudyMetrics({ project }: CaseStudyMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {project.metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-5"
        >
          <div className="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">
            {metric.label}
          </div>
          <div className="mt-3 text-xl font-semibold text-[var(--text-primary)]">
            {metric.value}
          </div>
        </div>
      ))}
    </div>
  );
}
