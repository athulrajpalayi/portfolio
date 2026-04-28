import Link from "next/link";

import type { MarketingContent } from "@/lib/content/site-content";

type FooterProps = {
  site: MarketingContent["site"];
  contact: MarketingContent["contact"];
};

export function Footer({ site, contact }: FooterProps) {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] py-8">
      <div className="page-shell flex flex-col gap-4 text-sm text-[var(--text-muted)] md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-medium text-[var(--text-primary)]">{site.displayName}</div>
          <div className="mt-1">{site.footerNote}</div>
        </div>
        <div className="flex items-center gap-5">
          <Link href={`mailto:${contact.email}`}>Email</Link>
          <Link href={contact.linkedin}>LinkedIn</Link>
          <span>{site.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
