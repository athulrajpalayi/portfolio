import { AdminShell } from "@/components/admin/admin-shell";
import { EditorPanel } from "@/components/admin/editor-panel";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { Textarea } from "@/components/primitives/textarea";
import { deleteAdminAppAction, saveAdminAppAction } from "@/app/admin/actions";
import Link from "next/link";
import { getAdminAppsData, type AdminAppInput } from "@/lib/admin/console";

export default async function AdminAppsPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const { apps, databaseReady } = await getAdminAppsData();

  return (
    <AdminShell
      title="Apps"
      description="Manage supporting product cards, visible modules, and lightweight app descriptions."
    >
      {saved ? (
        <div className="rounded-[24px] border border-[rgba(40,240,211,0.18)] bg-[rgba(40,240,211,0.08)] px-5 py-4 text-sm text-[var(--text-secondary)]">
          Application card changes saved.
        </div>
      ) : null}

      <div className="flex justify-end">
        <Link href="/admin/apps/new">
          <button className="rounded-2xl border border-[rgba(40,240,211,0.2)] bg-[rgba(40,240,211,0.06)] px-5 py-2.5 text-sm text-[var(--accent-teal)] transition-colors duration-200 hover:bg-[rgba(40,240,211,0.12)]">
            + New App
          </button>
        </Link>
      </div>

      <div className="grid gap-6">
        {apps.map((app: AdminAppInput) => (
          <div key={app.id} className="grid gap-1">
          <form action={saveAdminAppAction}>
            <EditorPanel title={app.title} description="Small product module metadata and visibility.">
              <input type="hidden" name="id" value={app.id} />
              <div className="grid gap-4 xl:grid-cols-2">
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Title
                  <Input name="title" defaultValue={app.title} disabled={!databaseReady} />
                </label>
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Tag
                  <Input name="tag" defaultValue={app.tag} disabled={!databaseReady} />
                </label>
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Icon
                  <Input name="icon" defaultValue={app.icon} disabled={!databaseReady} />
                </label>
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Order
                  <Input name="order" type="number" defaultValue={String(app.order)} disabled={!databaseReady} />
                </label>
                <label className="xl:col-span-2 grid gap-2 text-sm text-[var(--text-secondary)]">
                  Value proposition
                  <Textarea name="value" defaultValue={app.value} disabled={!databaseReady} />
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                  <input type="checkbox" name="visible" defaultChecked={app.visible} disabled={!databaseReady} />
                  Visible on the public site
                </label>
              </div>
              <div className="mt-5 flex justify-end">
                <Button type="submit" variant="admin" disabled={!databaseReady}>
                  Save app
                </Button>
              </div>
            </EditorPanel>
          </form>
          <form action={deleteAdminAppAction} className="flex justify-end px-1">
            <input type="hidden" name="id" value={app.id} />
            <button
              type="submit"
              disabled={!databaseReady}
              className="text-xs text-[var(--danger)] opacity-50 transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-20"
            >
              Delete app
            </button>
          </form>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
