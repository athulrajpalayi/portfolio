import { AdminShell } from "@/components/admin/admin-shell";
import { EditorPanel } from "@/components/admin/editor-panel";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { Textarea } from "@/components/primitives/textarea";
import { saveAdminSettingsAction } from "@/app/admin/actions";
import { getAdminSettingsData } from "@/lib/admin/console";

export default async function AdminSettingsPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const { site, databaseReady } = await getAdminSettingsData();

  return (
    <AdminShell
      title="Settings"
      description="Brand metadata, deployment values, and site-wide identity settings."
    >
      {saved ? (
        <div className="rounded-[24px] border border-[rgba(40,240,211,0.18)] bg-[rgba(40,240,211,0.08)] px-5 py-4 text-sm text-[var(--text-secondary)]">
          Settings saved and revalidated.
        </div>
      ) : null}

      <form action={saveAdminSettingsAction} className="grid gap-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <EditorPanel title="Brand metadata" description="The values the public shell uses for identity and positioning.">
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Display name
                <Input name="displayName" defaultValue={site.displayName} disabled={!databaseReady} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Monogram
                <Input name="monogram" defaultValue={site.monogram} disabled={!databaseReady} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Nav badge
                <Input name="navBadge" defaultValue={site.navBadge} disabled={!databaseReady} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Role label
                <Input name="roleLabel" defaultValue={site.roleLabel} disabled={!databaseReady} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Location
                <Input name="location" defaultValue={site.location} disabled={!databaseReady} />
              </label>
            </div>
          </EditorPanel>

          <EditorPanel title="Deployment metadata" description="Values tied to your domain, VPS, and public asset paths.">
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Resume path
                <Input name="resumePath" defaultValue={site.resumePath} disabled={!databaseReady} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Domain
                <Input name="domain" defaultValue={site.domain} disabled={!databaseReady} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Server IP
                <Input name="serverIp" defaultValue={site.serverIp} disabled={!databaseReady} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Footer note
                <Textarea name="footerNote" defaultValue={site.footerNote} disabled={!databaseReady} />
              </label>
              <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                Copyright
                <Input name="copyright" defaultValue={site.copyright} disabled={!databaseReady} />
              </label>
            </div>
          </EditorPanel>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="admin" disabled={!databaseReady}>
            Save settings
          </Button>
        </div>
      </form>
    </AdminShell>
  );
}
