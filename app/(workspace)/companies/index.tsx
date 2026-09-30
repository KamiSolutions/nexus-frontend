/**
 * Companies screen — real tenant/company directory.
 *
 * Replaces the old `useTenant().companies` demo array (`lib/tenant.ts`'s
 * hardcoded `demoTenant`, still used elsewhere for the active-company
 * switcher/branding) with nexus-platform-service's real
 * `GET /api/v1/companies`, itself backed by nexus-identity-service's
 * tenant registry. `totalCompanies` and the row list are `null`/`[]`
 * (never a fabricated count or placeholder rows) whenever the directory
 * isn't reachable — the status banner says why.
 */
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { ResourceScreen } from "@/components/dashboard/ResourceScreen";
import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { Surface } from "@/components/ui/Surface";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { getCompanies, type CompaniesResult } from "@/services/platform/companiesService";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type CompanyRow = {
  displayName: string;
  tenantId: string;
  deploymentMode: string;
};

const columns: DataTableColumn<CompanyRow>[] = [
  { key: "displayName", label: "Company", width: 240 },
  { key: "tenantId", label: "Tenant ID", width: 220 },
  { key: "deploymentMode", label: "Deployment mode", width: 170 },
];

export default function CompaniesRoute() {
  const state = useAsyncResource<CompaniesResult>(getCompanies);
  const { colors } = useEnterpriseTheme();

  return (
    <ResourceScreen
      title="Company Management"
      subtitle="Real tenant/company directory, sourced live from nexus-identity-service's tenant registry — no demo rows."
      state={state}
      loadingLabel="Loading the company directory..."
    >
      {(data) => (
        <>
          <StatusBanner label="Company directory" status={data.status} />

          <View style={styles.metrics}>
            <Surface style={styles.metric}>
              <StatusBadge label="Companies" tone="blue" />
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {data.totalCompanies ?? "Unknown"}
              </Text>
            </Surface>
            <Surface style={styles.metric}>
              <StatusBadge label="Dedicated deployments" tone="emerald" />
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {data.companies.filter((company) => company.deploymentMode === "dedicated").length}
              </Text>
            </Surface>
            <Surface style={styles.metric}>
              <StatusBadge label="Shared deployments" tone="slate" />
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {data.companies.filter((company) => company.deploymentMode === "shared").length}
              </Text>
            </Surface>
          </View>

          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Company directory</Text>
            <DataTable
              columns={columns}
              rows={data.companies.map((company) => ({
                displayName: company.displayName,
                tenantId: company.tenantId,
                deploymentMode: company.deploymentMode,
              }))}
            />
          </View>
        </>
      )}
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
});
