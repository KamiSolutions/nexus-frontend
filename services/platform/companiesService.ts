/**
 * Companies client — calls nexus-platform-service's real
 * `GET /api/v1/companies` through the gateway (`app/services/platform/companies_service.py`
 * on the backend, itself backed by nexus-identity-service's tenant
 * directory — see that service's `app/api/v1/tenants.py`).
 *
 * Replaces the Companies screen's old `useTenant().companies` demo array
 * (`lib/tenant.ts`'s hardcoded `demoTenant`) with the real, provisioned
 * tenant list. Per the project's core rule, `companies` comes back `[]`
 * (never fabricated placeholder rows) whenever `status` isn't Operational,
 * and `totalCompanies` is `null` in that case too — this client passes
 * that distinction straight through rather than defaulting it to `0`.
 */
import { getJSON } from "@/lib/apiClient";
import type { ServiceStatus } from "@/services/platform/overviewService";

export type CompanyRecord = {
  tenantId: string;
  displayName: string;
  deploymentMode: string;
};

export type CompaniesResult = {
  generatedAt: string;
  tenantId: string;
  totalCompanies: number | null;
  companies: CompanyRecord[];
  status: ServiceStatus;
};

type CompanyRecordBody = {
  tenant_id: string;
  display_name: string;
  deployment_mode: string;
};

type CompaniesResponseBody = {
  generated_at: string;
  tenant_id: string;
  total_companies: number | null;
  companies: CompanyRecordBody[];
  status: { service_name: string; status: ServiceStatus["status"]; detail: string | null };
};

export async function getCompanies(token: string, tenantId: string): Promise<CompaniesResult> {
  const body = await getJSON<CompaniesResponseBody>("/api/v1/companies", { token, tenantId });

  return {
    generatedAt: body.generated_at,
    tenantId: body.tenant_id,
    totalCompanies: body.total_companies,
    companies: body.companies.map((company) => ({
      tenantId: company.tenant_id,
      displayName: company.display_name,
      deploymentMode: company.deployment_mode,
    })),
    status: {
      serviceName: body.status.service_name,
      status: body.status.status,
      detail: body.status.detail,
    },
  };
}
