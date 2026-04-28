import { isDatabaseConfigured, runOptionalDatabaseQuery } from "@/lib/db/prisma";

export type AdminRole = "OWNER" | "EDITOR" | "AUDITOR";

export type StoredAdminUser = {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  role: AdminRole;
  createdAt: string;
  twoFactor: {
    secret: string;
    enabled: boolean;
  } | null;
};

export type AdminAuthState = {
  configured: boolean;
  hasDatabase: boolean;
  hasBootstrapEnv: boolean;
  hasOwnerUser: boolean;
  checklist: string[];
  users: StoredAdminUser[];
};

export function getAdminSetupChecklist() {
  return [
    "DATABASE_URL",
    "SESSION_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD_HASH",
    "ADMIN_TOTP_SECRET"
  ];
}

export function hasBootstrapAdminEnv() {
  return Boolean(
    process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD_HASH &&
      process.env.ADMIN_TOTP_SECRET &&
      process.env.SESSION_SECRET
  );
}

function normalizeAdminRole(role: string): AdminRole {
  if (role === "OWNER" || role === "EDITOR" || role === "AUDITOR") {
    return role;
  }

  return "OWNER";
}

function mapStoredAdminUser(user: {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
  twoFactor: {
    secret: string;
    enabled: boolean;
  } | null;
}): StoredAdminUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    passwordHash: user.passwordHash,
    role: normalizeAdminRole(user.role),
    createdAt: user.createdAt.toISOString(),
    twoFactor: user.twoFactor
      ? {
          secret: user.twoFactor.secret,
          enabled: user.twoFactor.enabled
        }
      : null
  };
}

export async function findStoredAdminUserByEmail(email: string): Promise<StoredAdminUser | null> {
  return runOptionalDatabaseQuery(async (db): Promise<StoredAdminUser | null> => {
    const user = await db.adminUser.findUnique({
      where: {
        email: email.trim().toLowerCase()
      },
      include: {
        twoFactor: true
      }
    });

    return user ? mapStoredAdminUser(user) : null;
  });
}

export async function listStoredAdminUsers(): Promise<StoredAdminUser[]> {
  return (
    (await runOptionalDatabaseQuery(async (db): Promise<StoredAdminUser[]> => {
      const users = await db.adminUser.findMany({
        include: {
          twoFactor: true
        },
        orderBy: {
          createdAt: "asc"
        }
      });

      return users.map((user) => mapStoredAdminUser(user));
    })) ?? []
  );
}

export async function getAdminAuthState(): Promise<AdminAuthState> {
  const users = await listStoredAdminUsers();

  return {
    configured: Boolean(process.env.SESSION_SECRET && (hasBootstrapAdminEnv() || users.length > 0)),
    hasDatabase: isDatabaseConfigured(),
    hasBootstrapEnv: hasBootstrapAdminEnv(),
    hasOwnerUser: users.length > 0,
    checklist: getAdminSetupChecklist(),
    users
  };
}
