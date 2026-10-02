/**
 * Leases client — calls nexus-claims-service's real
 * `GET /api/v1/leases/summary` and, as of 2026-10-02, the real
 * `GET /api/v1/leases/leases` ledger through the gateway.
 *
 * Leases gained real write endpoints (POST/PUT/DELETE) once COMPANY_ADMIN
 * was given `leases:create`/`leases:manage` in the combined RBAC model —
 * see app/services/claims/lease_service.py on the backend. `listLeases`
 * mirrors `claimsService.ts`'s `listClaims()` pattern exactly.
 */
import { getJSON } from "@/lib/apiClient";

export type LeaseSummary = {
  tenantId: string;
  generatedAt: string;
  activeLeases: number;
  leasesRequiringInspection: number;
};

type LeaseSummaryBody = {
  tenant_id: string;
  generated_at: string;
  active_leases: number;
  leases_requiring_inspection: number;
};

export async function getLeaseSummary(token: string, tenantId: string): Promise<LeaseSummary> {
  const body = await getJSON<LeaseSummaryBody>("/api/v1/leases/summary", { token, tenantId });

  return {
    tenantId: body.tenant_id,
    generatedAt: body.generated_at,
    activeLeases: body.active_leases,
    leasesRequiringInspection: body.leases_requiring_inspection,
  };
}

export type LeaseStatus = "active" | "pending_inspection" | "expired" | "terminated";

export type LeaseRecord = {
  id: string;
  tenantId: string;
  propertyName: string;
  lesseeName: string;
  monthlyRent: number;
  status: LeaseStatus;
  createdAt: string;
  updatedAt: string;
};

type LeaseRecordBody = {
  id: string;
  tenant_id: string;
  property_name: string;
  lessee_name: string;
  monthly_rent: number;
  status: LeaseStatus;
  created_at: string;
  updated_at: string;
};

export async function listLeases(token: string, tenantId: string): Promise<LeaseRecord[]> {
  const body = await getJSON<LeaseRecordBody[]>("/api/v1/leases/leases", { token, tenantId });

  return body.map((lease) => ({
    id: lease.id,
    tenantId: lease.tenant_id,
    propertyName: lease.property_name,
    lesseeName: lease.lessee_name,
    monthlyRent: lease.monthly_rent,
    status: lease.status,
    createdAt: lease.created_at,
    updatedAt: lease.updated_at,
  }));
}
