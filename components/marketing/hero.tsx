import Link from "next/link";
import { ArrowRight, ShieldCheck, Terminal } from "lucide-react";

import { MagneticButton } from "@/components/motion/magnetic-button";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { ParticleNetwork } from "@/components/motion/particle-network";
import { Reveal } from "@/components/motion/reveal";
import { Typewriter } from "@/components/motion/typewriter";
import { Badge } from "@/components/primitives/badge";
import { buttonVariants } from "@/components/primitives/button";
import { GlassCard } from "@/components/primitives/glass-card";
import type { MarketingContent } from "@/lib/content/site-content";
import { cn } from "@/lib/utils/cn";

type HeroProps = {
  hero: MarketingContent["hero"];
};

const typewriterStrings = [
  "Ethical Hacker · Security Tester.",
  "AI-assisted product builder.",
  "WhatsApp automation · Android apps.",
  "CEH v10 · OWASP · Kali Linux.",
];

export function Hero({ hero }: HeroProps) {
  return (
    <section id="about" className="section-anchor relative overflow-hidden section-shell">
      {/* Particle gravity-well background */}
      <ParticleNetwork className="absolute inset-0 h-full w-full opacity-70" />

      <div className="page-shell relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">

        {/* ── Left column ── */}
        <Reveal className="relative">

          {/* Terminal boot line */}
          <div className="font-terminal mb-5 flex items-center gap-3 text-[11px] tracking-[0.22em] text-[var(--text-muted)]">
            <Terminal className="h-3.5 w-3.5 text-[var(--accent-teal)]" />
            <span className="text-[var(--text-muted)]">[SYSTEM]</span>
            <span className="text-[var(--accent-teal)]">&gt; portfolio.v26</span>
            <span className="text-[var(--success)] opacity-80">✓ READY</span>
          </div>

          {/* Role badge */}
          <Badge className="mb-6 bg-[rgba(59,130,246,0.1)] text-[var(--accent-blue)]">
            {hero.eyebrow}
          </Badge>

          {/* Name — Orbitron + glitch on hover */}
          <h1
            className="glitch-text font-display max-w-4xl text-[38px] font-bold leading-[1.06] tracking-[-0.03em] text-[var(--text-primary)] neon-teal md:text-[52px]"
            data-text={hero.title}
            style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)" }}
          >
            {hero.title}
          </h1>

          {/* Typewriter accent line */}
          <div className="font-terminal mt-4 flex items-start gap-2 text-base text-[var(--accent-teal)] md:text-lg">
            <span className="mt-0.5 opacity-60">&gt;</span>
            <Typewriter strings={typewriterStrings} className="font-terminal" />
          </div>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--text-secondary)] md:text-xl md:leading-[1.7]">
            {hero.subtitle}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--text-muted)] md:text-lg">
            {hero.intro}
          </p>

          {/* Chips — terminal bracket style */}
          <div className="mt-8 flex flex-wrap gap-3">
            {hero.chips.map((chip, index) => (
              <Reveal key={chip} delay={0.1 + index * 0.08}>
                <Badge className="font-terminal border-[rgba(40,240,211,0.28)] bg-[rgba(40,240,211,0.06)] px-4 py-2 text-[var(--accent-teal)] tracking-[0.12em]">
                  [{chip}]
                </Badge>
              </Reveal>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <MagneticButton>
              <Link href="#projects" className={buttonVariants({ variant: "primary" })}>
                View Projects
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="#contact" className={buttonVariants({ variant: "secondary" })}>
                Contact
              </Link>
            </MagneticButton>
          </div>

          {/* Status line */}
          <div className="font-terminal mt-12 inline-flex items-center gap-4 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-xs text-[var(--text-muted)] tracking-[0.16em]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[rgba(40,240,211,0.7)]" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent-teal)]" />
            </span>
            {hero.statusLabel}
          </div>
        </Reveal>

        {/* ── Right column — HUD card ── */}
        <Reveal delay={0.12}>
          <ParallaxLayer intensity={12} className="perspective-[1200px]">
            <div className="relative mx-auto max-w-[560px]">

              {/* Glow blobs */}
              <div className="absolute -left-12 top-10 h-40 w-40 rounded-full bg-[rgba(40,240,211,0.18)] blur-3xl" />
              <div className="absolute -right-8 bottom-6 h-52 w-52 rounded-full bg-[rgba(59,130,246,0.2)] blur-3xl" />

              {/* HUD scan line */}
              <div
                className="pointer-events-none absolute inset-x-0 z-20 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(40,240,211,0.5), transparent)",
                  animation: "hudScan 5s ease-in-out infinite",
                }}
              />

              <GlassCard
                spotlight
                className="hud-card hero-panel-grid relative min-h-[540px] overflow-hidden rounded-[32px] border-[rgba(40,240,211,0.14)] bg-[rgba(9,12,21,0.72)] p-6 shadow-[0_0_60px_rgba(40,240,211,0.07)]"
              >
                {/* Header row */}
                <div className="mb-5 flex items-center justify-between rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3">
                  <div>
                    <div className="font-terminal text-[10px] uppercase tracking-[0.38em] text-[var(--accent-teal)]">
                      // Cyber Build Layer
                    </div>
                    <div className="mt-1.5 text-sm font-medium text-[var(--text-primary)]">
                      Security & Product Platform
                    </div>
                  </div>
                  <div className="rounded-full border border-[rgba(40,240,211,0.22)] bg-[rgba(40,240,211,0.1)] p-3 text-[var(--accent-teal)]"
                    style={{ boxShadow: "0 0 12px rgba(40,240,211,0.25)" }}>
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                  {/* Integration signal */}
                  <GlassCard className="rounded-[26px] bg-[rgba(255,255,255,0.04)] p-5">
                    <div className="font-terminal text-[10px] uppercase tracking-[0.38em] text-[var(--text-muted)]">
                      &gt; integration_signal
                    </div>
                    <div className="mt-4 space-y-3">
                      {["Cybersecurity", "Android Apps", "Automation", "AI Tools"].map((item, index) => (
                        <div
                          key={item}
                          className="signal-track flex items-center justify-between rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3"
                        >
                          <span className="font-terminal text-sm text-[var(--text-primary)]">{item}</span>
                          <span className="font-terminal text-xs text-[var(--accent-teal)] opacity-60">{`0${index + 1}`}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <div className="grid gap-4">
                    {/* Status dots */}
                    <GlassCard className="rounded-[26px] bg-[rgba(255,255,255,0.04)] p-5">
                      <div className="font-terminal text-[10px] uppercase tracking-[0.38em] text-[var(--text-muted)]">
                        &gt; status_matrix
                      </div>
                      <div className="mt-5 space-y-3">
                        {[
                          { label: "Ethical hacking", color: "bg-[rgba(40,240,211,0.95)]", glow: "0 0 6px rgba(40,240,211,0.7)" },
                          { label: "Product building", color: "bg-[rgba(59,130,246,0.95)]", glow: "0 0 6px rgba(59,130,246,0.7)" },
                          { label: "System security", color: "bg-[rgba(139,92,246,0.95)]", glow: "0 0 6px rgba(139,92,246,0.7)" },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                            <span
                              className={cn("h-2.5 w-2.5 rounded-full", item.color)}
                              style={{ boxShadow: item.glow }}
                            />
                            {item.label}
                          </div>
                        ))}
                      </div>
                    </GlassCard>

                    {/* Reliability score */}
                    <GlassCard className="rounded-[26px] bg-[rgba(255,255,255,0.04)] p-5">
                      <div className="font-terminal text-[10px] uppercase tracking-[0.38em] text-[var(--text-muted)]">
                        &gt; uptime_score
                      </div>
                      <div
                        className="font-display mt-4 text-5xl font-bold tracking-[-0.06em] text-[var(--text-primary)]"
                        style={{
                          fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
                          textShadow: "0 0 20px rgba(40,240,211,0.4)",
                        }}
                      >
                        98<span className="text-[var(--accent-teal)]">%</span>
                      </div>
                      <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">
                        Operational confidence · observability · control.
                      </p>
                    </GlassCard>
                  </div>
                </div>

                {/* Bottom row */}
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {[
                    "Security-first thinking",
                    "AI-accelerated builds",
                    "Real-world delivery",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-4 py-4 text-xs leading-6 text-[var(--text-secondary)] transition-colors duration-300 hover:border-[rgba(40,240,211,0.2)] hover:bg-[rgba(40,240,211,0.04)]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </ParallaxLayer>
        </Reveal>
      </div>
    </section>
  );
}
