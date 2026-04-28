import { AppsGrid } from "@/components/marketing/apps-grid";
import { Capabilities } from "@/components/marketing/capabilities";
import { ContactPanel } from "@/components/marketing/contact-panel";
import { FeaturedProjects } from "@/components/marketing/featured-projects";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { Navbar } from "@/components/marketing/navbar";
import { SystemsArchitecture } from "@/components/marketing/systems-architecture";
import type { MarketingContent } from "@/lib/content/site-content";

type HomePageViewProps = {
  content: MarketingContent;
};

export function HomePageView({ content }: HomePageViewProps) {
  return (
    <main>
      <Navbar site={content.site} />
      <Hero hero={content.hero} />
      <Capabilities items={content.capabilities} />
      <FeaturedProjects projects={content.featuredProjects} />
      <SystemsArchitecture nodes={content.systemsFlow} />
      <AppsGrid apps={content.apps} />
      <ContactPanel contact={content.contact} />
      <Footer site={content.site} contact={content.contact} />
    </main>
  );
}
