import { AdminShell } from "@/components/admin/admin-shell";
import { EditorPanel } from "@/components/admin/editor-panel";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { Textarea } from "@/components/primitives/textarea";
import { saveAdminAppAction } from "@/app/admin/actions";
import { isDatabaseConfigured } from "@/lib/db/prisma";

export default async function NewAppPage() {
  const databaseReady = isDatabaseConfigured();

  return (
    <AdminShell
      title="New App"
      description="Add a new application card to the portfolio apps grid."
    >
      {!databaseReady ? (
        <div className="rounded-[24px] border border-[rgba(255,191,102,0.16)] bg-[rgba(255,191,102,0.08)] px-5 py-4 text-sm leading-7 text-[var(--text-secondary)]">
          App creation requires a live PostgreSQL connection. Connect the database first.
        </div>
      ) : null}

      <form action={saveAdminAppAction}>
        <EditorPanel title="New App" description="Fill in fields and save to add to the public apps grid.">
          <input type="hidden" name="id" value="fallback-new" />
          <input type="hidden" name="order" value="99" />
          <div className="grid gap-4 xl:grid-cols-2">
            <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
              Title
              <Input name="title" placeholder="App name" disabled={!databaseReady} />
            </label>
            <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
              Tag
              <Input name="tag" placeholder="Android App" disabled={!databaseReady} />
            </label>
            <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
              Icon
              <Input
                name="icon"
                placeholder="globe"
                disabled={!databaseReady}
              />
              <span className="text-[10px] text-[var(--text-muted)] leading-5">
                Valid values: phone · droplets · file-text · palette · globe · message-circle · bell · calculator · image · video
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" name="visible" defaultChecked disabled={!databaseReady} />
              Visible on the public site
            </label>
            <label className="xl:col-span-2 grid gap-2 text-sm text-[var(--text-secondary)]">
              Value proposition
              <Textarea name="value" placeholder="One or two sentences describing what this app does." disabled={!databaseReady} />
            </label>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <a
              href="/admin/apps"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              ← Back to apps
            </a>
            <Button type="submit" variant="admin" disabled={!databaseReady}>
              Create app
            </Button>
          </div>
        </EditorPanel>
      </form>
    </AdminShell>
  );
}
