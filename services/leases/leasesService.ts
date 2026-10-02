/**
 * Lease summary client — calls nexus-claims-service's real
 * `GET /api/v1/leases/summary` through the gateway.
 *
 * New file: the Lease Portfolio screen (app/(workspace)/leases/index.tsx)
 * previously hardcoded fake per-property rows (Premier Plaza, etc.) with
 * no service client at all. Leases got no write endpoints in the
 * write-endpoints round (no domain role holds `leases:create` in the RBAC
 * model), so there is no per-lease list to fetch yet — only this
 * tenant-wide aggregate summary. The screen shows these real counts and
 * says plainly that per-property records aren't available yet, rather
 * than inventing rows to fill a table.
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
