/**
 * Lease Portfolio screen — real per-property lease ledger.
 *
 * 2026-10-02: replaced the old "no write endpoints yet" honest-notice
 * screen (leases had no domain role holding `leases:create`) with a real
 * `DataTable` list, now that COMPANY_ADMIN holds `leases:create`/
 * `leases:manage` and nexus-claims-service's real
 * `GET /api/v1/leases/leases` ledger exists — mirrors the Claims Center
 * screen's pattern exactly. Metrics are computed from these real rows,
 * never the separate, simulated `/leases/summary` aggregate (that
 * endpoint's `random.Random(tenant_id)`-seeded totals are not reconciled
 * against this real ledger, so mixing the two would be misleading).
 */
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { ResourceScreen } from "@/components/dashboard/ResourceScreen";
import { Surface } from "@/components/ui/Surface";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { listLeases, type LeaseRecord } from "@/services/leases/leasesService";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type LeaseRow = {
  propertyName: string;
  lesseeName: string;
  monthlyRent: string;
  status: string;
};

const columns: DataTableColumn<LeaseRow>[] = [
  { key: "propertyName", label: "Property", width: 220 },
  { key: "lesseeName", label: "Lessee", width: 220 },
  { key: "monthlyRent", label: "Monthly rent", width: 150 },
  { key: "status", label: "Status", width: 160 },
];

export default function LeasesRoute() {
  const state = useAsyncResource<LeaseRecord[]>(listLeases);
  const { colors } = useEnterpriseTheme();

  return (
    <ResourceScreen
      title="Lease Portfolio"
      subtitle="Real lease records, sourced live from nexus-claims-service — no demo rows."
      state={state}
      loadingLabel="Loading lease records..."
    >
      {(leases) => {
        const activeCount = leases.filter((lease) => lease.status === "active").length;
        const inspectionCount = leases.filter((lease) => lease.status === "pending_inspection").length;
        const totalMonthlyRent = leases.reduce((sum, lease) => sum + lease.monthlyRent, 0);

        return (
          <>
            <View style={styles.metrics}>
              <Surface style={styles.metric}>
                <StatusBadge label="Active" tone="emerald" />
                <Text style={[styles.metricValue, { color: colors.text }]}>{activeCount}</Text>
              </Surface>
              <Surface style={styles.metric}>
                <StatusBadge label="Pending inspection" tone="amber" />
                <Text style={[styles.metricValue, { color: colors.text }]}>{inspectionCount}</Text>
              </Surface>
              <Surface style={styles.metric}>
                <StatusBadge label="Monthly rent" tone="blue" />
                <Text style={[styles.metricValue, { color: colors.text }]}>
                  R{totalMonthlyRent.toLocaleString()}
                </Text>
              </Surface>
              <Surface style={styles.metric}>
                <StatusBadge label="Total leases" tone="slate" />
                <Text style={[styles.metricValue, { color: colors.text }]}>{leases.length}</Text>
              </Surface>
            </View>

            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Lease records</Text>
              {leases.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                  No lease records yet for this tenant.
                </Text>
              ) : (
                <DataTable
                  columns={columns}
                  rows={leases.map((lease) => ({
                    propertyName: lease.propertyName,
                    lesseeName: lease.lesseeName,
                    monthlyRent: `R${lease.monthlyRent.toLocaleString()}`,
                    status: lease.status,
                  }))}
                />
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
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
