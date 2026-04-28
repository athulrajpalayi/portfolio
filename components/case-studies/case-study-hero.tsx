import { Badge } from "@/components/primitives/badge";
import type { FeaturedProject } from "@/lib/content/site-content";

type CaseStudyHeroProps = {
  project: FeaturedProject;
};

export function CaseStudyHero({ project }: CaseStudyHeroProps) {
  return (
    <section className="section-shell pt-16">
      <div className="page-shell">
        <Badge className="bg-[rgba(59,130,246,0.12)] text-[var(--accent-blue)]">
          {project.domain}
        </Badge>
        <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-[-0.06em] text-[var(--text-primary)] md:text-6xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--text-secondary)]">
          {project.summary}
        </p>
      </div>
    </section>
  );
}
