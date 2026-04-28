import {
  Cloud,
  Database,
  Shield,
  Smartphone,
  Sparkles,
  Workflow,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { GlassCard } from "@/components/primitives/glass-card";
import { SectionHeader } from "@/components/primitives/section-header";
import type { Capability } from "@/lib/content/site-content";

const iconMap = {
  workflow: Workflow,
  sparkles: Sparkles,
  shield: Shield,
  cloud: Cloud,
  smartphone: Smartphone,
  database: Database,
};

const iconGlow = {
  workflow: "rgba(40,240,211,0.7)",
  sparkles: "rgba(59,130,246,0.7)",
  shield: "rgba(139,92,246,0.7)",
  cloud: "rgba(40,240,211,0.7)",
  smartphone: "rgba(59,130,246,0.7)",
  database: "rgba(139,92,246,0.7)",
};

type CapabilitiesProps = {
  items: Capability[];
};

export function Capabilities({ items }: CapabilitiesProps) {
  return (
    <section className="section-shell section-anchor" aria-labelledby="capabilities-heading">
      <div className="page-shell">
        <SectionHeader
          label="Core Capabilities"
          title="Core capabilities"
          description="Enterprise reliability, integration awareness, and a strong bias toward clean systems that are practical to operate."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon];
            const glow = iconGlow[item.icon];

            return (
              <Reveal key={item.title} delay={index * 0.06}>
                <GlassCard
                  as="section"
                  aria-label={item.title}
                  className="hud-card group h-full rounded-[28px] border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(40,240,211,0.2)] hover:bg-[rgba(40,240,211,0.03)] hover:shadow-[0_24px_80px_rgba(40,240,211,0.09)]"
                >
                  {/* Icon with neon glow */}
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(40,240,211,0.18)] bg-[rgba(40,240,211,0.08)] text-[var(--accent-teal)] transition-all duration-300 group-hover:border-[rgba(40,240,211,0.35)] group-hover:bg-[rgba(40,240,211,0.14)]"
                    style={{ transition: "box-shadow 300ms" }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ filter: `drop-shadow(0 0 4px ${glow})` }}
                    />
                  </div>

                  {/* Terminal index */}
                  <div
                    className="mt-4 text-[10px] tracking-[0.32em] text-[var(--text-muted)] opacity-0 transition-opacity duration-300 group-hover:opacity-70"
                    style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
                  >
                    MODULE_{String(index + 1).padStart(2, "0")}
                  </div>

                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--accent-teal)]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
