import Link from "next/link";
import type { ReactNode } from "react";

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/systems", label: "Systems" },
  { href: "/admin/apps", label: "Apps" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/security", label: "Security" },
  { href: "/admin/settings", label: "Settings" }
];

type AdminShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AdminShell({ title, description, children }: AdminShellProps) {
  return (
    <div className="admin-grid min-h-screen bg-[var(--bg-base)]">
      <div className="page-shell grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="glass-surface rounded-[28px] p-5">
          <div className="mb-6">
            <div className="eyebrow mb-3">Admin Control</div>
            <div className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
              Secure Console
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              Premium control plane for content, systems, media, and operational visibility.
            </p>
          </div>
          <nav className="grid gap-2">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors duration-300 hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--text-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form action="/api/auth/logout" method="post" className="mt-8">
            <button
              type="submit"
              className="w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-left text-sm text-[var(--text-secondary)] transition-colors duration-300 hover:border-[rgba(40,240,211,0.18)] hover:text-[var(--text-primary)]"
            >
              Sign out
            </button>
          </form>
        </aside>

        <div className="grid gap-6">
          <header className="glass-surface rounded-[28px] p-6">
            <div className="eyebrow mb-3">Operations Layer</div>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
              {title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-[var(--text-secondary)]">
              {description}
            </p>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
