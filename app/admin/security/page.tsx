import { AdminShell } from "@/components/admin/admin-shell";
import { AuditLogList } from "@/components/admin/audit-log-list";
import { EditorPanel } from "@/components/admin/editor-panel";
import { getAdminSecurityData } from "@/lib/admin/console";

export default async function AdminSecurityPage() {
  const { authState, auditEvents, bootstrapCommand, databaseReady } = await getAdminSecurityData();

  return (
    <AdminShell
      title="Security"
      description="Audit visibility, auth expectations, and deployment bootstrap guidance live here."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <EditorPanel title="Auth state" description="Current bootstrap and runtime status for admin access.">
          <div className="grid gap-3 text-sm text-[var(--text-secondary)]">
            <div>Database configured: {databaseReady ? "Yes" : "No"}</div>
            <div>Bootstrap env present: {authState.hasBootstrapEnv ? "Yes" : "No"}</div>
            <div>Owner user stored: {authState.hasOwnerUser ? "Yes" : "No"}</div>
            <div>Session secret present: {process.env.SESSION_SECRET ? "Yes" : "No"}</div>
          </div>
        </EditorPanel>
        <EditorPanel title="Bootstrap command" description="Recommended once the VPS environment variables are in place.">
          <pre className="overflow-x-auto rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-4 text-xs leading-7 text-[var(--text-secondary)]">
            {bootstrapCommand}
          </pre>
        </EditorPanel>
      </div>

      <AuditLogList events={auditEvents} />
    </AdminShell>
  );
}
