/**
 * Claims Center screen — real claim ledger.
 *
 * Replaces the old hardcoded "CLM-2026-041" demo rows with
 * nexus-claims-service's real `GET /api/v1/claims/claims` (the same table
 * the write-endpoints round's POST/PUT/DELETE operate on). Metrics are
 * computed from the real rows returned, never a fabricated figure.
 */
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { ResourceScreen } from "@/components/dashboard/ResourceScreen";
import { Surface } from "@/components/ui/Surface";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useCachedAsyncResource } from "@/hooks/useCachedAsyncResource";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { listClaims, type ClaimRecord } from "@/services/claims/claimsService";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ClaimRow = {
  claimNumber: string;
  claimantName: string;
  claimValue: string;
  status: string;
};

const columns: DataTableColumn<ClaimRow>[] = [
  { key: "claimNumber", label: "Claim #", width: 160 },
  { key: "claimantName", label: "Claimant", width: 220 },
  { key: "claimValue", label: "Value", width: 140 },
  { key: "status", label: "Status", width: 140 },
];

export default function ClaimsRoute() {
  const state = useCachedAsyncResource<ClaimRecord[]>("claims", listClaims);
  const { colors } = useEnterpriseTheme();

  return (
    <ResourceScreen
      title="Claims Center"
      subtitle="Real claim records, sourced live from nexus-claims-service — no demo rows."
      state={state}
      loadingLabel="Loading claim records..."
    >
      {(claims) => {
        const openCount = claims.filter((claim) => claim.status === "submitted" || claim.status === "under_review").length;
        const totalValue = claims.reduce((sum, claim) => sum + claim.claimValue, 0);

        return (
          <>
            <View style={styles.metrics}>
              <Surface style={styles.metric}>
                <StatusBadge label="Open" tone="amber" />
                <Text style={[styles.metricValue, { color: colors.text }]}>{openCount}</Text>
              </Surface>
              <Surface style={styles.metric}>
                <StatusBadge label="Total value" tone="emerald" />
                <Text style={[styles.metricValue, { color: colors.text }]}>R{totalValue.toLocaleString()}</Text>
              </Surface>
              <Surface style={styles.metric}>
                <StatusBadge label="Total claims" tone="blue" />
                <Text style={[styles.metricValue, { color: colors.text }]}>{claims.length}</Text>
              </Surface>
            </View>

            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Claim records</Text>
              {claims.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                  No claim records yet for this tenant.
                </Text>
              ) : (
                <DataTable
                  columns={columns}
                  rows={claims.map((claim) => ({
                    claimNumber: claim.claimNumber,
                    claimantName: claim.claimantName,
                    claimValue: `R${claim.claimValue.toLocaleString()}`,
                    status: claim.status,
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
