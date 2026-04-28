import { Button } from "@/components/primitives/button";
import { GlassCard } from "@/components/primitives/glass-card";
import { Input } from "@/components/primitives/input";
import { getAdminAuthState } from "@/lib/auth/admin-users";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const authState = await getAdminAuthState();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <GlassCard className="w-full max-w-[520px] rounded-[32px] p-8">
        <div className="eyebrow mb-4">Admin Access</div>
        <h1 className="text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
          Secure control plane login
        </h1>
        <p className="mt-4 text-sm leading-8 text-[var(--text-secondary)]">
          Email, password, and TOTP verification protect the portfolio admin surface.
        </p>

        {!authState.configured ? (
          <div className="mt-6 rounded-[24px] border border-[rgba(255,191,102,0.16)] bg-[rgba(255,191,102,0.08)] px-5 py-5 text-sm text-[var(--text-secondary)]">
            <div className="font-medium text-[var(--text-primary)]">Setup required</div>
            <div className="mt-2 leading-7">
              Configure the platform secrets and run the bootstrap flow before using the control plane.
            </div>
            <ul className="mt-3 grid gap-2">
              {authState.checklist.map((item: (typeof authState.checklist)[number]) => (
                <li key={item} className="font-mono text-xs text-[var(--text-muted)]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-[24px] border border-[rgba(255,125,156,0.16)] bg-[rgba(255,125,156,0.08)] px-5 py-4 text-sm text-[var(--text-secondary)]">
            {error}
          </div>
        ) : null}

        <form action="/api/auth/login" method="post" className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
            Email
            <Input name="email" type="email" placeholder="owner@athulrajpalayi.com" required />
          </label>
          <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
            Password
            <Input name="password" type="password" placeholder="Secure password" required />
          </label>
          <Button type="submit" variant="admin" className="mt-2">
            Continue to 2FA
          </Button>
        </form>
      </GlassCard>
    </main>
  );
}
