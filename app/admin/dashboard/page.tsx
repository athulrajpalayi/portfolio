import { AdminShell } from "@/components/admin/admin-shell";
import { AuditLogList } from "@/components/admin/audit-log-list";
import { EditorPanel } from "@/components/admin/editor-panel";
import { getAdminDashboardData } from "@/lib/admin/console";

export default async function AdminDashboardPage() {
  const { counts, auditEvents, databaseReady } = await getAdminDashboardData();

  return (
    <AdminShell
      title="Dashboard"
      description="Overview of portfolio activity, content health, and admin surface status."
    >
      {!databaseReady ? (
        <div className="rounded-[24px] border border-[rgba(255,191,102,0.16)] bg-[rgba(255,191,102,0.08)] px-5 py-4 text-sm leading-7 text-[var(--text-secondary)]">
          PostgreSQL is not configured in this environment yet. The console is showing safe fallbacks, and persistent edits will unlock as soon as `DATABASE_URL` is available.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-3">
        <EditorPanel title="Content health" description="Live counts across the public experience.">
          <div className="grid gap-3 text-sm text-[var(--text-secondary)]">
            <div>{counts.projects} case studies available</div>
            <div>{counts.systems} system nodes configured</div>
            <div>{counts.apps} application cards visible</div>
          </div>
        </EditorPanel>
        <EditorPanel title="Security state" description="Operational controls for admin access and monitoring.">
          <div className="grid gap-3 text-sm text-[var(--text-secondary)]">
            <div>{counts.users} admin users registered</div>
            <div>{counts.contacts} contact submissions tracked</div>
            <div>Signed session cookies remain active</div>
          </div>
        </EditorPanel>
        <EditorPanel title="Operational focus" description="Where the current control plane is strongest right now.">
          <div className="grid gap-3 text-sm text-[var(--text-secondary)]">
            <div>Public content and site settings</div>
            <div>Case-study narrative updates</div>
            <div>Inbox visibility and audit history</div>
          </div>
        </EditorPanel>
      </div>

      <AuditLogList events={auditEvents} />
    </AdminShell>
  );
}
