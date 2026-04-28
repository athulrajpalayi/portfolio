export type AuditEvent = {
  title: string;
  detail: string;
  status: "ok" | "warning" | "error";
  occurredAt: string;
};

export function createAuditEvent(
  title: string,
  detail: string,
  status: AuditEvent["status"] = "ok"
): AuditEvent {
  return {
    title,
    detail,
    status,
    occurredAt: new Date().toISOString()
  };
}
