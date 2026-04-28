export function isAdminAuthConfigured() {
  return Boolean(
    process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD_HASH &&
      process.env.ADMIN_TOTP_SECRET &&
      process.env.SESSION_SECRET
  );
}

export function getConfiguredAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? null;
}

export function getAdminSetupChecklist() {
  return [
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD_HASH",
    "ADMIN_TOTP_SECRET",
    "SESSION_SECRET",
    "DATABASE_URL"
  ];
}

export function matchesConfiguredAdmin(email: string) {
  const configuredEmail = getConfiguredAdminEmail();
  return Boolean(configuredEmail && configuredEmail === email.trim().toLowerCase());
}
