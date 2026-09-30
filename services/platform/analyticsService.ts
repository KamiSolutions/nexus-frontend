/**
 * Analytics client — calls nexus-platform-service's real
 * `GET /api/v1/analytics/summary` through the gateway.
 *
 * Replaces `services/analytics/analyticsService.ts` (an unused demo stub
 * returning `lib/analytics.ts`'s hardcoded `executiveKpis`/`revenueTrend`/
 * `approvalPipeline` — never actually wired into the Analytics screen).
 * That file is removed; nothing else imported it.
 *
 * Every per-domain field (`financials`/`hr`/`fleet`/`cases`/`claims`/
 * `leases`) is optional and paired with an entry in `domainStatus`
 * explaining why it's missing when it is — a genuine outage, or the
 * caller's own token lacking that domain's `:view` scope (Unknown, not a
 * fabricated Attention Required) — mirroring the backend's
 * `AnalyticsSummaryResponse` field-for-field per domain service's own
 * summary schema. The UI must render `domainStatus` for every domain
 * rather than silently treating a missing field as "nothing to show."
 */
import { getJSON } from "@/lib/apiClient";
import type { ServiceStatus } from "@/services/platform/overviewService";

export type PolicyProviderBreakdown = {
  providerName: string;
  activePolicies: number;
  monthlyPremiumTotal: number;
  lapsedLast30Days: number;
};

export type FinancialsSummary = {
  totalActivePolicies: number;
  totalMonthlyPremiumRevenue: number;
  outstandingClaimsValue: number;
  providers: PolicyProviderBreakdown[];
};

export type DepartmentBreakdown = {
  departmentName: string;
  headcount: number;
  openPositions: number;
  pendingLeaveRequests: number;
};

export type HrSummary = {
  totalEmployees: number;
  activeContracts: number;
  pendingLeaveRequests: number;
  departments: DepartmentBreakdown[];
};

export type VehicleClassBreakdown = {
  vehicleClass: string;
  totalVehicles: number;
  inService: number;
  inMaintenance: number;
  overdueForMaintenance: number;
};

export type FleetSummary = {
  totalVehicles: number;
  vehiclesInMaintenance: number;
  vehiclesOverdueForMaintenance: number;
  classes: VehicleClassBreakdown[];
};

export type CaseStageBreakdown = {
  stageName: string;
  openCases: number;
  pendingDocumentation: number;
};

export type CasesSummary = {
  totalOpenCases: number;
  totalPendingDocumentation: number;
  stages: CaseStageBreakdown[];
};

export type ClaimStatusBreakdown = {
  statusName: string;
  claimCount: number;
  totalValue: number;
};

export type ClaimsSummary = {
  totalOpenClaims: number;
  totalClaimsValue: number;
  overdueForReview: number;
  statuses: ClaimStatusBreakdown[];
};

export type LeasesSummary = {
  activeLeases: number;
  leasesRequiringInspection: number;
};

export type AnalyticsSummary = {
  generatedAt: string;
  tenantId: string;
  domainStatus: ServiceStatus[];
  financials: FinancialsSummary | null;
  hr: HrSummary | null;
  fleet: FleetSummary | null;
  cases: CasesSummary | null;
  claims: ClaimsSummary | null;
  leases: LeasesSummary | null;
};

// Backend snake_case body shapes — kept file-local since nothing else
// needs to reference the wire format directly.
type Body = Record<string, any>;

function mapDomainStatus(body: Body[]): ServiceStatus[] {
  return body.map((entry) => ({
    serviceName: entry.service_name,
    status: entry.status,
    detail: entry.detail,
  }));
}

export async function getAnalyticsSummary(token: string, tenantId: string): Promise<AnalyticsSummary> {
  const body = await getJSON<Body>("/api/v1/analytics/summary", { token, tenantId });

  return {
    generatedAt: body.generated_at,
    tenantId: body.tenant_id,
    domainStatus: mapDomainStatus(body.domain_status),
    financials: body.financials
      ? {
          totalActivePolicies: body.financials.total_active_policies,
          totalMonthlyPremiumRevenue: body.financials.total_monthly_premium_revenue,
          outstandingClaimsValue: body.financials.outstanding_claims_value,
          providers: body.financials.providers.map((provider: Body) => ({
            providerName: provider.provider_name,
            activePolicies: provider.active_policies,
            monthlyPremiumTotal: provider.monthly_premium_total,
            lapsedLast30Days: provider.lapsed_last_30_days,
          })),
        }
      : null,
    hr: body.hr
      ? {
          totalEmployees: body.hr.total_employees,
          activeContracts: body.hr.active_contracts,
          pendingLeaveRequests: body.hr.pending_leave_requests,
          departments: body.hr.departments.map((department: Body) => ({
            departmentName: department.department_name,
            headcount: department.headcount,
            openPositions: department.open_positions,
            pendingLeaveRequests: department.pending_leave_requests,
          })),
        }
      : null,
    fleet: body.fleet
      ? {
          totalVehicles: body.fleet.total_vehicles,
          vehiclesInMaintenance: body.fleet.vehicles_in_maintenance,
          vehiclesOverdueForMaintenance: body.fleet.vehicles_overdue_for_maintenance,
          classes: body.fleet.classes.map((vehicleClass: Body) => ({
            vehicleClass: vehicleClass.vehicle_class,
            totalVehicles: vehicleClass.total_vehicles,
            inService: vehicleClass.in_service,
            inMaintenance: vehicleClass.in_maintenance,
            overdueForMaintenance: vehicleClass.overdue_for_maintenance,
          })),
        }
      : null,
    cases: body.cases
      ? {
          totalOpenCases: body.cases.total_open_cases,
          totalPendingDocumentation: body.cases.total_pending_documentation,
          stages: body.cases.stages.map((stage: Body) => ({
            stageName: stage.stage_name,
            openCases: stage.open_cases,
            pendingDocumentation: stage.pending_documentation,
          })),
        }
      : null,
    claims: body.claims
      ? {
          totalOpenClaims: body.claims.total_open_claims,
          totalClaimsValue: body.claims.total_claims_value,
          overdueForReview: body.claims.overdue_for_review,
          statuses: body.claims.statuses.map((status: Body) => ({
            statusName: status.status_name,
            claimCount: status.claim_count,
            totalValue: status.total_value,
          })),
        }
      : null,
    leases: body.leases
      ? {
          activeLeases: body.leases.active_leases,
          leasesRequiringInspection: body.leases.leases_requiring_inspection,
        }
      : null,
  };
}
