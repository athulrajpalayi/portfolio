import { AdminShell } from "@/components/admin/admin-shell";
import { EditorPanel } from "@/components/admin/editor-panel";
import { Button } from "@/components/primitives/button";
import { updateInboxStatusAction } from "@/app/admin/actions";
import { getAdminInboxData } from "@/lib/admin/console";

const statusOptions = ["NEW", "REVIEWING", "RESPONDED", "ARCHIVED"] as const;

export default async function AdminInboxPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const { submissions, databaseReady } = await getAdminInboxData();

  return (
    <AdminShell
      title="Inbox"
      description="Track contact submissions and follow-up state from one place."
    >
      {saved ? (
        <div className="rounded-[24px] border border-[rgba(40,240,211,0.18)] bg-[rgba(40,240,211,0.08)] px-5 py-4 text-sm text-[var(--text-secondary)]">
          Submission status updated.
        </div>
      ) : null}

      {!databaseReady ? (
        <div className="rounded-[24px] border border-[rgba(255,191,102,0.16)] bg-[rgba(255,191,102,0.08)] px-5 py-4 text-sm leading-7 text-[var(--text-secondary)]">
          The inbox needs PostgreSQL before submissions can be stored and tracked.
        </div>
      ) : null}

      {submissions.length === 0 ? (
        <EditorPanel title="No submissions yet" description="Once the public contact form starts storing data, incoming inquiries will appear here for triage." />
      ) : (
        <div className="grid gap-6">
          {submissions.map((submission: (typeof submissions)[number]) => (
            <form key={submission.id} action={updateInboxStatusAction}>
              <EditorPanel title={submission.name} description={submission.email}>
                <input type="hidden" name="submissionId" value={submission.id} />
                <div className="grid gap-4">
                  <div className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-4 text-sm leading-7 text-[var(--text-secondary)]">
                    {submission.message}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <select
                      name="status"
                      defaultValue={submission.status}
                      className="h-12 rounded-2xl border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.05)] px-4 text-sm text-[var(--text-primary)] outline-none"
                    >
                      {statusOptions.map((status: (typeof statusOptions)[number]) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" variant="admin">
                      Update status
                    </Button>
                  </div>
                </div>
              </EditorPanel>
            </form>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
