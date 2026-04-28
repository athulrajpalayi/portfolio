import { AdminShell } from "@/components/admin/admin-shell";
import { EditorPanel } from "@/components/admin/editor-panel";
import { getAdminMediaData } from "@/lib/admin/console";

export default async function AdminMediaPage() {
  const { databaseReady, resumePath } = await getAdminMediaData();

  return (
    <AdminShell
      title="Media"
      description="Resume paths, portfolio imagery, and future upload controls."
    >
      {!databaseReady ? (
        <div className="rounded-[24px] border border-[rgba(255,191,102,0.16)] bg-[rgba(255,191,102,0.08)] px-5 py-4 text-sm leading-7 text-[var(--text-secondary)]">
          Media uploads are not wired yet. The current control surface exposes the live resume path and keeps the upload zone ready for a later storage pass.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <EditorPanel title="Resume asset" description="Current public download target used by the navbar and site settings.">
          <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-4 text-sm text-[var(--text-secondary)]">
            {resumePath}
          </div>
        </EditorPanel>
        <EditorPanel title="Portfolio media" description="Portraits, project visuals, and upload-backed media management can be layered in next without changing the public content model." />
      </div>
    </AdminShell>
  );
}
