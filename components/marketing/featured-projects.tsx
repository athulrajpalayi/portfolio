"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/primitives/badge";
import { GlassCard } from "@/components/primitives/glass-card";
import { SectionHeader } from "@/components/primitives/section-header";
import type { FeaturedProject } from "@/lib/content/site-content";
import { projectHref } from "@/lib/content/mappers";

type FeaturedProjectsProps = {
  projects: FeaturedProject[];
};

const accentColors = [
  { border: "rgba(40,240,211,0.22)", shadow: "rgba(40,240,211,0.12)", text: "var(--accent-teal)" },
  { border: "rgba(59,130,246,0.22)", shadow: "rgba(59,130,246,0.12)", text: "var(--accent-blue)" },
  { border: "rgba(139,92,246,0.22)", shadow: "rgba(139,92,246,0.12)", text: "var(--accent-violet)" },
];

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section
      id="projects"
      className="section-shell section-anchor"
      aria-labelledby="featured-projects-heading"
    >
      <div className="page-shell">
        <SectionHeader
          label="Featured Projects"
          title="Featured projects"
          description="Each project is presented like a product story: what was broken, how the architecture moved, and what became more reliable after the work."
        />

        <div className="grid gap-6">
          {projects.map((project, index) => {
            const accent = accentColors[index % accentColors.length];

            return (
              <Reveal key={project.slug} delay={index * 0.08}>
                <GlassCard
                  className="hud-card group overflow-hidden rounded-[32px] p-0 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    transition: "transform 300ms ease, border-color 300ms ease, box-shadow 300ms ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = accent.border;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 24px 80px ${accent.shadow}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}
                >
                  <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                    {/* Left: project info */}
                    <div className="relative overflow-hidden border-b border-[rgba(255,255,255,0.08)] p-7 lg:border-b-0 lg:border-r lg:p-8">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(40,240,211,0.1),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.16),transparent_44%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="absolute inset-0 translate-y-2 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_65%)] transition-transform duration-500 group-hover:translate-y-0" />

                      <div className="relative z-10">
                        {/* Terminal index + badge */}
                        <div className="mb-3 flex items-center gap-3">
                          <span
                            className="text-[10px] tracking-[0.32em] text-[var(--text-muted)]"
                            style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
                          >
                            PROJ_{String(index + 1).padStart(2, "0")}
                          </span>
                          <Badge
                            className="text-xs"
                            style={{ color: accent.text, backgroundColor: `${accent.border.replace("0.22)", "0.1)")}`, borderColor: accent.border }}
                          >
                            {project.featuredLabel}
                          </Badge>
                        </div>

                        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--text-primary)] md:text-3xl">
                          {project.title}
                        </h3>
                        <p className="mt-4 max-w-xl text-base leading-8 text-[var(--text-secondary)]">
                          {project.summary}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <Badge
                              key={tag}
                              className="border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-[var(--text-muted)]"
                              style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: "11px" }}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Link
                          href={projectHref(project)}
                          className="group/link mt-8 inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300"
                          style={{ color: accent.text }}
                        >
                          View Case Study
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                        </Link>
                      </div>
                    </div>

                    {/* Right: metrics */}
                    <div className="grid gap-4 p-7 lg:p-8">
                      {project.metrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-5 py-5 transition-all duration-300 group-hover:border-[rgba(255,255,255,0.12)] group-hover:bg-[rgba(255,255,255,0.05)]"
                        >
                          <div
                            className="text-[10px] uppercase tracking-[0.32em] text-[var(--text-muted)]"
                            style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
                          >
                            {metric.label}
                          </div>
                          <div className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                            {metric.value}
                          </div>
                        </div>
                      ))}
                      <div
                        className="rounded-[24px] border px-5 py-5 text-sm leading-8 text-[var(--text-secondary)]"
                        style={{
                          borderColor: accent.border,
                          backgroundColor: `${accent.border.replace("0.22)", "0.07)")}`,
                        }}
                      >
                        Domain:{" "}
                        <span className="font-medium text-[var(--text-primary)]">{project.domain}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
