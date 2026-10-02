/**
 * Policies screen — real policy ledger.
 *
 * Replaces the old hardcoded "Santam/Hollard/Old Mutual" demo rows with
 * nexus-financials-service's real `GET /api/v1/financials/policies` (the
 * same table the write-endpoints round's POST/PUT/DELETE operate on).
 * Metrics are computed from the real rows returned, never a fabricated
 * figure — a failed call surfaces as an honest error via ResourceScreen,
 * it never falls back to the old demo data.
 */
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { ModuleQuickLinks } from "@/components/dashboard/ModuleQuickLinks";
import { ResourceScreen } from "@/components/dashboard/ResourceScreen";
import { Surface } from "@/components/ui/Surface";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { listPolicies, type PolicyRecord } from "@/services/finance/financeService";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type PolicyRow = {
  policyNumber: string;
  holderName: string;
  providerName: string;
  monthlyPremium: string;
  status: string;
};

const columns: DataTableColumn<PolicyRow>[] = [
  { key: "policyNumber", label: "Policy #", width: 160 },
  { key: "holderName", label: "Holder", width: 220 },
  { key: "providerName", label: "Provider", width: 180 },
  { key: "monthlyPremium", label: "Monthly premium", width: 160 },
  { key: "status", label: "Status", width: 120 },
];

export default function PoliciesRoute() {
  const state = useAsyncResource<PolicyRecord[]>(listPolicies);
  const { colors } = useEnterpriseTheme();

  return (
    <View style={{ gap: 16 }}>
      <ModuleQuickLinks links={[{ label: "Submit a claim", href: "/(workspace)/policies/claim" }]} />
      <ResourceScreen
        title="Policies"
        subtitle="Real policy records, sourced live from nexus-financials-service — no demo rows."
        state={state}
        loadingLabel="Loading policy records..."
      >
        {(policies) => {
          const activeCount = policies.filter((policy) => policy.status === "active").length;
          const lapsedCount = policies.filter((policy) => policy.status === "lapsed").length;
          const totalMonthlyPremium = policies.reduce((sum, policy) => sum + policy.monthlyPremium, 0);

          return (
            <>
              <View style={styles.metrics}>
                <Surface style={styles.metric}>
                  <StatusBadge label="Active" tone="emerald" />
                  <Text style={[styles.metricValue, { color: colors.text }]}>{activeCount}</Text>
                </Surface>
                <Surface style={styles.metric}>
                  <StatusBadge label="Lapsed" tone="amber" />
                  <Text style={[styles.metricValue, { color: colors.text }]}>{lapsedCount}</Text>
                </Surface>
                <Surface style={styles.metric}>
                  <StatusBadge label="Monthly premium" tone="blue" />
                  <Text style={[styles.metricValue, { color: colors.text }]}>
                    R{totalMonthlyPremium.toLocaleString()}
                  </Text>
                </Surface>
              </View>

              <View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Policy records</Text>
                {policies.length === 0 ? (
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    No policy records yet for this tenant.
                  </Text>
                ) : (
                  <DataTable
                    columns={columns}
                    rows={policies.map((policy) => ({
                      policyNumber: policy.policyNumber,
                      holderName: policy.holderName,
                      providerName: policy.providerName,
                      monthlyPremium: `R${policy.monthlyPremium.toLocaleString()}`,
                      status: policy.status,
                    }))}
                  />
                )}
              </View>
            </>
          );
        }}
      </ResourceScreen>
    </View>
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
