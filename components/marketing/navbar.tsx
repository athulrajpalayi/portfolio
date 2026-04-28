"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/primitives/badge";
import { buttonVariants } from "@/components/primitives/button";
import type { MarketingContent } from "@/lib/content/site-content";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#systems", label: "Systems" },
  { href: "#apps", label: "Apps" },
  { href: "#contact", label: "Contact" },
];

type NavbarProps = {
  site: MarketingContent["site"];
};

export function Navbar({ site }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-4 z-50 px-4 md:px-0">
      <div
        className={cn(
          "page-shell mt-4 flex items-center justify-between gap-4 rounded-[24px] border px-4 py-3 transition-all duration-500 md:px-6",
          scrolled
            ? "border-[rgba(40,240,211,0.14)] bg-[rgba(7,10,18,0.88)] shadow-[0_20px_90px_rgba(3,8,20,0.5),0_0_0_1px_rgba(40,240,211,0.08)] backdrop-blur-xl"
            : "border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] backdrop-blur-md"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="relative h-10 w-10 rounded-2xl p-px"
            style={{
              background: "linear-gradient(135deg, rgba(40,240,211,0.3), rgba(59,130,246,0.25))",
              boxShadow: scrolled ? "0 0 12px rgba(40,240,211,0.2)" : "none",
              transition: "box-shadow 500ms",
            }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[rgba(7,10,18,0.92)]">
              <span
                className="font-display text-sm font-bold text-[var(--accent-teal)]"
                style={{
                  fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
                  textShadow: "0 0 8px rgba(40,240,211,0.5)",
                }}
              >
                {site.monogram}
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-[0.04em] text-[var(--text-primary)]">
              {site.displayName}
            </div>
            <Badge className="mt-1 border-transparent bg-[rgba(59,130,246,0.14)] px-2.5 py-0.5 font-terminal text-[10px] tracking-[0.22em] text-[var(--text-muted)]"
              style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>
              {site.navBadge}
            </Badge>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden items-center gap-7 text-sm text-[var(--text-secondary)] md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative transition-colors duration-300 hover:text-[var(--accent-teal)]"
              style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: "12px", letterSpacing: "0.1em" }}
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[var(--accent-teal)] transition-transform duration-300 group-hover:scale-x-100"
                style={{ boxShadow: "0 0 6px rgba(40,240,211,0.6)" }} />
            </a>
          ))}
        </nav>

        {/* Resume button */}
        <Link
          href={site.resumePath}
          className={cn(buttonVariants({ variant: "secondary" }), "hidden md:inline-flex")}
        >
          <Download className="h-4 w-4" />
          Resume
        </Link>
      </div>
    </div>
  );
}
