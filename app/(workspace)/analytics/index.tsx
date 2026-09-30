/**
 * Analytics screen — cross-domain summary, real per-domain data or a
 * stated reason it's missing.
 *
 * Replaces the old fully-hardcoded metrics/rows (fabricated "Insights: 34",
 * "+9.4% forecast", made-up revenue/fleet/hiring rows) with
 * nexus-platform-service's real `GET /api/v1/analytics/summary`. A domain
 * this caller's token can't see (e.g. a FINANCE_MANAGER has no `hr:view`
 * scope) renders as "Unknown — missing scope" rather than being silently
 * omitted or shown as zero, and a domain service that's down renders as
 * "Attention required" with the real reason — never a fabricated number.
 */
import { DomainStatusList } from "@/components/dashboard/DomainStatusList";
import { ResourceScreen } from "@/components/dashboard/ResourceScreen";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { Surface } from "@/components/ui/Surface";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { getAnalyticsSummary, type AnalyticsSummary } from "@/services/platform/analyticsService";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type DomainSummaryRow = {
  domain: string;
  metric: string;
  value: string;
};

const columns: DataTableColumn<DomainSummaryRow>[] = [
  { key: "domain", label: "Domain", width: 140 },
  { key: "metric", label: "Metric", width: 260 },
  { key: "value", label: "Value", width: 140 },
];

function buildRows(data: AnalyticsSummary): DomainSummaryRow[] {
  const rows: DomainSummaryRow[] = [];

  if (data.financials) {
    rows.push(
      { domain: "Financials", metric: "Active policies", value: String(data.financials.totalActivePolicies) },
      { domain: "Financials", metric: "Monthly premium revenue", value: data.financials.totalMonthlyPremiumRevenue.toLocaleString() },
      { domain: "Financials", metric: "Outstanding claims value", value: data.financials.outstandingClaimsValue.toLocaleString() },
    );
  }
  if (data.hr) {
    rows.push(
      { domain: "HR", metric: "Total employees", value: String(data.hr.totalEmployees) },
      { domain: "HR", metric: "Active contracts", value: String(data.hr.activeContracts) },
      { domain: "HR", metric: "Pending leave requests", value: String(data.hr.pendingLeaveRequests) },
    );
  }
  if (data.fleet) {
    rows.push(
      { domain: "Fleet", metric: "Total vehicles", value: String(data.fleet.totalVehicles) },
      { domain: "Fleet", metric: "In maintenance", value: String(data.fleet.vehiclesInMaintenance) },
      { domain: "Fleet", metric: "Overdue for maintenance", value: String(data.fleet.vehiclesOverdueForMaintenance) },
    );
  }
  if (data.cases) {
    rows.push(
      { domain: "Cases", metric: "Open cases", value: String(data.cases.totalOpenCases) },
      { domain: "Cases", metric: "Pending documentation", value: String(data.cases.totalPendingDocumentation) },
    );
  }
  if (data.claims) {
    rows.push(
      { domain: "Claims", metric: "Open claims", value: String(data.claims.totalOpenClaims) },
      { domain: "Claims", metric: "Total claims value", value: data.claims.totalClaimsValue.toLocaleString() },
      { domain: "Claims", metric: "Overdue for review", value: String(data.claims.overdueForReview) },
    );
  }
  if (data.leases) {
    rows.push(
      { domain: "Leases", metric: "Active leases", value: String(data.leases.activeLeases) },
      { domain: "Leases", metric: "Requiring inspection", value: String(data.leases.leasesRequiringInspection) },
    );
  }

  return rows;
}

export default function AnalyticsRoute() {
  const state = useAsyncResource<AnalyticsSummary>(getAnalyticsSummary);
  const { colors } = useEnterpriseTheme();

  return (
    <ResourceScreen
      title="Analytics Center"
      subtitle="Cross-domain business intelligence — real data per domain, fanned out live across every domain service."
      state={state}
      loadingLabel="Fetching cross-domain analytics..."
    >
      {(data) => {
        const rows = buildRows(data);
        const domainsWithData = [data.financials, data.hr, data.fleet, data.cases, data.claims, data.leases].filter(
          Boolean,
        ).length;

        return (
          <>
            <View style={styles.metrics}>
              <Surface style={styles.metric}>
                <StatusBadge label="Domains with data" tone="blue" />
                <Text style={[styles.metricValue, { color: colors.text }]}>{domainsWithData} / 6</Text>
              </Surface>
              <Surface style={styles.metric}>
                <StatusBadge label="Metrics shown" tone="emerald" />
                <Text style={[styles.metricValue, { color: colors.text }]}>{rows.length}</Text>
              </Surface>
            </View>

            <DomainStatusList title="Domain reachability" statuses={data.domainStatus} />

            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Domain metrics</Text>
              {rows.length > 0 ? (
                <DataTable columns={columns} rows={rows} />
              ) : (
                <Text style={[styles.empty, { color: colors.textMuted }]}>
                  No domain currently has reachable data for this tenant — see domain reachability above.
                </Text>
              )}
            </View>
          </>
        );
      }}
    </ResourceScreen>
  );
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  metric: {
    flex: 1,
    minWidth: 170,
    gap: 14,
  },
  metricValue: {
    fontSize: 26,
    fontWeight: "900",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
  },
  empty: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
});
