import { AdminShell } from "@/components/admin/admin-shell";
import { EditorPanel } from "@/components/admin/editor-panel";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { Textarea } from "@/components/primitives/textarea";
import { saveAdminSystemNodeAction } from "@/app/admin/actions";
import { getAdminSystemsData } from "@/lib/admin/console";

export default async function AdminSystemsPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const { nodes, databaseReady } = await getAdminSystemsData();

  return (
    <AdminShell
      title="Systems"
      description="Control architecture nodes, captions, and ordering across the system-integration story."
    >
      {saved ? (
        <div className="rounded-[24px] border border-[rgba(40,240,211,0.18)] bg-[rgba(40,240,211,0.08)] px-5 py-4 text-sm text-[var(--text-secondary)]">
          System node changes saved.
        </div>
      ) : null}

      <div className="grid gap-6">
        {nodes.map((node: (typeof nodes)[number]) => (
          <form key={node.id} action={saveAdminSystemNodeAction}>
            <EditorPanel title={node.title} description="Architecture node label, caption, and display order.">
              <input type="hidden" name="id" value={node.id} />
              <div className="grid gap-4 xl:grid-cols-2">
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Title
                  <Input name="title" defaultValue={node.title} disabled={!databaseReady} />
                </label>
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Order
                  <Input name="order" type="number" defaultValue={String(node.order)} disabled={!databaseReady} />
                </label>
                <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
                  Label
                  <Input name="label" defaultValue={node.label} disabled={!databaseReady} />
                </label>
                <label className="xl:col-span-2 grid gap-2 text-sm text-[var(--text-secondary)]">
                  Caption
                  <Textarea name="caption" defaultValue={node.caption} disabled={!databaseReady} />
                </label>
              </div>
              <div className="mt-5 flex justify-end">
                <Button type="submit" variant="admin" disabled={!databaseReady}>
                  Save node
                </Button>
              </div>
            </EditorPanel>
          </form>
        ))}
      </div>
    </AdminShell>
  );
}
