import { query } from "@/lib/db";

export interface AuditLogInput {
  adminId: number;
  action: string;
  resourceType: string;
  resourceId?: number;
  details?: Record<string, unknown>;
  ip?: string | null;
}

export async function writeAuditLog(input: AuditLogInput): Promise<void> {
  try {
    await query(
      `INSERT INTO admin_audit_log (admin_id, action, resource_type, resource_id, details, ip)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        input.adminId,
        input.action.slice(0, 80),
        input.resourceType.slice(0, 40),
        input.resourceId ?? null,
        input.details ? JSON.stringify(input.details) : null,
        input.ip?.slice(0, 45) ?? null,
      ]
    );
  } catch (err) {
    console.warn("[audit] kayıt yazılamadı:", err);
  }
}
