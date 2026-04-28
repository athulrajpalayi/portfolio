import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { GlassCard } from "@/components/primitives/glass-card";
import { SectionHeader } from "@/components/primitives/section-header";
import type { SystemNode } from "@/lib/content/site-content";

type SystemsArchitectureProps = {
  nodes: SystemNode[];
};

const STEP_STYLES = [
  { accent: "#28f0d3", bg: "rgba(40,240,211,0.07)", border: "rgba(40,240,211,0.18)" },
  { accent: "#3b82f6", bg: "rgba(59,130,246,0.07)", border: "rgba(59,130,246,0.18)" },
  { accent: "#8b5cf6", bg: "rgba(139,92,246,0.07)", border: "rgba(139,92,246,0.18)" },
  { accent: "#28f0d3", bg: "rgba(40,240,211,0.07)", border: "rgba(40,240,211,0.18)" },
  { accent: "#3b82f6", bg: "rgba(59,130,246,0.07)", border: "rgba(59,130,246,0.18)" },
  { accent: "#8b5cf6", bg: "rgba(139,92,246,0.07)", border: "rgba(139,92,246,0.18)" },
];

export function SystemsArchitecture({ nodes }: SystemsArchitectureProps) {
  return (
    <section id="systems" className="section-shell section-anchor">
      <div className="page-shell">
        <SectionHeader
          label="Systems & Integrations"
          title="Systems & integrations"
          description="The integration layer is presented as a clean enterprise pipeline. It shows how source systems, workflow logic, financial tools, storage, and reporting can move as one coordinated system."
        />

        <Reveal>
          <GlassCard className="rounded-[32px] bg-[rgba(255,255,255,0.04)] p-6 md:p-8 lg:p-10">

            {/* Section label + subtitle */}
            <div className="mb-8">
              <div className="eyebrow mb-1">Signal Flow</div>
              <p className="text-sm text-[var(--text-muted)]">End-to-end development process — six stages from idea to iteration</p>
            </div>

            {/* Step cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {nodes.map((node, index) => {
                const s = STEP_STYLES[index % STEP_STYLES.length];
                const isLast = index === nodes.length - 1;
                return (
                  <div key={node.title} className="relative flex flex-col gap-3">
                    {/* Card */}
                    <div
                      className="flex flex-1 flex-col rounded-2xl border p-4 transition-colors duration-200 hover:bg-[rgba(255,255,255,0.04)]"
                      style={{ borderColor: s.border, background: s.bg }}
                    >
                      {/* Step badge */}
                      <div className="mb-3 flex items-center gap-2">
                        <div
                          className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                          style={{ background: s.accent, color: "#070a12" }}
                        >
                          {index + 1}
                        </div>
                        <span
                          className="truncate text-[9px] font-semibold uppercase tracking-[0.18em]"
                          style={{ color: s.accent }}
                        >
                          {node.label}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="mb-2 text-sm font-semibold leading-snug text-[var(--text-primary)]">
                        {node.title}
                      </div>

                      {/* Caption */}
                      <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                        {node.caption}
                      </p>
                    </div>

                    {/* Connector arrow (desktop only, between cards) */}
                    {!isLast && (
                      <div
                        className="absolute -right-[7px] top-[30px] z-10 hidden items-center justify-center lg:flex"
                        aria-hidden="true"
                      >
                        <ArrowRight
                          className="h-3 w-3"
                          style={{ color: s.accent, opacity: 0.7 }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-8 h-px bg-[rgba(255,255,255,0.06)]" />

            {/* Integration notes + why it matters */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-5">
                <div className="eyebrow mb-4">Integration Notes</div>
                <ul className="space-y-3">
                  {[
                    { dot: "#28f0d3", text: "Normalized handoffs reduce brittle point-to-point logic." },
                    { dot: "#3b82f6", text: "Workflow checkpoints create traceable operational state." },
                    { dot: "#8b5cf6", text: "Reporting persistence strengthens auditability and visibility." },
                  ].map((item) => (
                    <li key={item.text} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                      <span
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: item.dot }}
                      />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[rgba(59,130,246,0.15)] bg-[rgba(59,130,246,0.06)] p-5">
                <div className="eyebrow mb-4 text-[var(--accent-blue)]">Why it matters</div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  This section proves systems thinking visually. It shows how operations, reporting,
                  finance, and workflow logic can move through a deliberate architecture rather than a
                  loose collection of tools.
                </p>
              </div>
            </div>

          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
