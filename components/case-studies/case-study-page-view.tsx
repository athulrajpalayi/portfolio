import Link from "next/link";

import { CaseStudyHero } from "@/components/case-studies/case-study-hero";
import { CaseStudyMetrics } from "@/components/case-studies/case-study-metrics";
import { CaseStudyTimeline } from "@/components/case-studies/case-study-timeline";
import { GlassCard } from "@/components/primitives/glass-card";
import { SectionHeader } from "@/components/primitives/section-header";
import type { FeaturedProject } from "@/lib/content/site-content";

type CaseStudyPageViewProps = {
  project: FeaturedProject;
};

export function CaseStudyPageView({ project }: CaseStudyPageViewProps) {
  return (
    <main>
      <CaseStudyHero project={project} />

      <section className="section-shell">
        <div className="page-shell grid gap-6">
          <CaseStudyMetrics project={project} />

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <GlassCard className="rounded-[32px] p-7">
              <SectionHeader
                label="Challenge"
                title="What needed to move"
                description={project.challenge}
              />
              <div className="grid gap-4">
                {project.architecture.map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-4 text-sm leading-7 text-[var(--text-secondary)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="rounded-[32px] p-7">
              <SectionHeader
                label="Solution Architecture"
                title="How the system was shaped"
                description="The implementation focused on clarity, repeatability, and operational confidence."
              />
              <div className="grid gap-4">
                {project.solution.map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-[rgba(59,130,246,0.12)] bg-[rgba(59,130,246,0.08)] px-4 py-4 text-sm leading-7 text-[var(--text-secondary)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <GlassCard className="rounded-[32px] p-7">
              <SectionHeader
                label="Outcomes"
                title="Outcomes"
                description="Practical improvements in reliability, process visibility, and execution speed."
              />
              <div className="grid gap-4">
                {project.outcomes.map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-[rgba(40,240,211,0.12)] bg-[rgba(40,240,211,0.08)] px-4 py-4 text-sm leading-7 text-[var(--text-secondary)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="grid gap-6">
              <GlassCard className="rounded-[32px] p-7">
                <SectionHeader
                  label="Tools Used"
                  title="Tools used"
                  description="Technology choices were selected around maintainability, visibility, and dependable delivery."
                />
                <div className="flex flex-wrap gap-3">
                  {project.tools.map((tool) => (
                    <div
                      key={tool}
                      className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm text-[var(--text-secondary)]"
                    >
                      {tool}
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="rounded-[32px] p-7">
                <SectionHeader
                  label="Execution Timeline"
                  title="Delivery timeline"
                  description="The phases below show how the work was framed and stabilized."
                />
                <CaseStudyTimeline steps={project.timeline} />
              </GlassCard>
            </div>
          </div>

          <div className="pb-20">
            <Link
              href="/#projects"
              className="inline-flex rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-3 text-sm text-[var(--text-secondary)] transition-colors duration-300 hover:border-[rgba(40,240,211,0.18)] hover:text-[var(--text-primary)]"
            >
              Back to all featured projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
