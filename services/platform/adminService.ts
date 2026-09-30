/**
 * Admin client — calls nexus-platform-service's real
 * `GET /api/v1/admin/summary` through the gateway.
 *
 * Rolls up three independently-fallible real data sources — the tenant
 * directory (nexus-identity-service), the audit log (nexus-audit-service),
 * and the cross-service health rollup (nexus-platform-service's own
 * Overview aggregation) — each carrying its own `ServiceStatus`. Replaces
 * the Admin screen's old hardcoded role/permission counts (`roleLabels`
 * used purely as a fixed-count summary) with the live counts this
 * endpoint actually computes; the RBAC role table itself
 * (`lib/permissions.ts`) is still the source of truth for role names and
 * permission strings, which don't change per tenant.
 */
import { getJSON } from "@/lib/apiClient";
import type { ServiceStatus } from "@/services/platform/overviewService";

export type AuditEventSummary = {
  eventId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  actorUserId: string;
  actorRole: string | null;
  occurredAt: string;
};

export type AdminSummary = {
  generatedAt: string;
  tenantId: string;
  totalTenants: number | null;
  tenantsStatus: ServiceStatus;
  totalAuditEvents: number | null;
  recentAuditEvents: AuditEventSummary[];
  auditStatus: ServiceStatus;
  servicesOperational: number;
  servicesAttentionRequired: number;
  servicesUnknown: number;
};

type ServiceStatusBody = { service_name: string; status: ServiceStatus["status"]; detail: string | null };

type AuditEventSummaryBody = {
  event_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  actor_user_id: string;
  actor_role: string | null;
  occurred_at: string;
};

type AdminSummaryResponseBody = {
  generated_at: string;
  tenant_id: string;
  total_tenants: number | null;
  tenants_status: ServiceStatusBody;
  total_audit_events: number | null;
  recent_audit_events: AuditEventSummaryBody[];
  audit_status: ServiceStatusBody;
  services_operational: number;
  services_attention_required: number;
  services_unknown: number;
};

function mapStatus(body: ServiceStatusBody): ServiceStatus {
  return { serviceName: body.service_name, status: body.status, detail: body.detail };
}

export async function getAdminSummary(token: string, tenantId: string): Promise<AdminSummary> {
  const body = await getJSON<AdminSummaryResponseBody>("/api/v1/admin/summary", { token, tenantId });

  return {
    generatedAt: body.generated_at,
    tenantId: body.tenant_id,
    totalTenants: body.total_tenants,
    tenantsStatus: mapStatus(body.tenants_status),
    totalAuditEvents: body.total_audit_events,
    recentAuditEvents: body.recent_audit_events.map((event) => ({
      eventId: event.event_id,
      action: event.action,
      resourceType: event.resource_type,
      resourceId: event.resource_id,
      actorUserId: event.actor_user_id,
      actorRole: event.actor_role,
      occurredAt: event.occurred_at,
    })),
    auditStatus: mapStatus(body.audit_status),
    servicesOperational: body.services_operational,
    servicesAttentionRequired: body.services_attention_required,
    servicesUnknown: body.services_unknown,
  };
}
