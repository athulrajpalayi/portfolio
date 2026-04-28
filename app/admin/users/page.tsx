import { AdminShell } from "@/components/admin/admin-shell";
import { DataTable } from "@/components/admin/data-table";
import { getAdminUsersData } from "@/lib/admin/console";

export default async function AdminUsersPage() {
  const { users, databaseReady } = await getAdminUsersData();

  return (
    <AdminShell
      title="Users & Roles"
      description="Owner, editor, and auditor roles live here with future team expansion in mind."
    >
      {!databaseReady ? (
        <div className="rounded-[24px] border border-[rgba(255,191,102,0.16)] bg-[rgba(255,191,102,0.08)] px-5 py-4 text-sm leading-7 text-[var(--text-secondary)]">
          User management becomes fully active after the first owner is seeded into PostgreSQL.
        </div>
      ) : null}

      <DataTable
        title="Admin users"
        columns={["User", "Email", "Role", "2FA"] as string[]}
        rows={
          users.length > 0
            ? users.map((user: (typeof users)[number]) => [
                user.displayName,
                user.email,
                user.role,
                user.twoFactor?.enabled ? "Required" : "Missing"
              ])
            : [["Bootstrap owner pending", "-", "OWNER", "Pending"]]
        }
      />
    </AdminShell>
  );
}
