import { Button } from "@/components/primitives/button";
import { GlassCard } from "@/components/primitives/glass-card";
import { Input } from "@/components/primitives/input";

export default async function VerifyTwoFactorPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <GlassCard className="w-full max-w-[520px] rounded-[32px] p-8">
        <div className="eyebrow mb-4">Two-Factor Verification</div>
        <h1 className="text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
          Confirm the secure access token
        </h1>
        <p className="mt-4 text-sm leading-8 text-[var(--text-secondary)]">
          Enter the six-digit code from your authenticator app to unlock the admin control plane.
        </p>

        {error ? (
          <div className="mt-6 rounded-[24px] border border-[rgba(255,125,156,0.16)] bg-[rgba(255,125,156,0.08)] px-5 py-4 text-sm text-[var(--text-secondary)]">
            {error}
          </div>
        ) : null}

        <form action="/api/auth/verify-2fa" method="post" className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
            Authenticator code
            <Input name="token" inputMode="numeric" pattern="[0-9]{6}" placeholder="123456" required />
          </label>
          <Button type="submit" variant="admin" className="mt-2">
            Verify and enter admin
          </Button>
        </form>
      </GlassCard>
    </main>
  );
}
