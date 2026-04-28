import { Bell, Calculator, Droplets, FileText, Globe, Image as ImageIcon, MessageCircle, Palette, Phone, Video } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/primitives/badge";
import { GlassCard } from "@/components/primitives/glass-card";
import { SectionHeader } from "@/components/primitives/section-header";
import type { AppCardItem } from "@/lib/content/site-content";

const iconMap = {
  phone: Phone,
  droplets: Droplets,
  "file-text": FileText,
  palette: Palette,
  globe: Globe,
  "message-circle": MessageCircle,
  bell: Bell,
  calculator: Calculator,
  image: ImageIcon,
  video: Video,
};

type AppsGridProps = {
  apps: AppCardItem[];
};

export function AppsGrid({ apps }: AppsGridProps) {
  return (
    <section id="apps" className="section-shell section-anchor">
      <div className="page-shell">
        <SectionHeader
          label="Apps Built"
          title="Smaller product builds that still carry a premium systems voice."
          description="Compact utilities and focused applications that show product thinking, interaction quality, and implementation discipline across different problem shapes."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {apps.map((app, index) => {
            const Icon = iconMap[app.icon];

            return (
              <Reveal key={app.title} delay={index * 0.06}>
                <GlassCard className="h-full rounded-[28px] bg-[rgba(255,255,255,0.04)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(59,130,246,0.22)] hover:shadow-[0_22px_70px_rgba(59,130,246,0.12)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(59,130,246,0.14)] bg-[rgba(59,130,246,0.08)] text-[var(--accent-blue)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                      {app.title}
                    </h3>
                    <Badge className="text-[10px] tracking-[0.24em]">{app.tag}</Badge>
                  </div>
                  <p className="mt-4 text-sm leading-8 text-[var(--text-secondary)]">{app.value}</p>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
