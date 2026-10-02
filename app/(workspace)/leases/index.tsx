/**
 * Lease Portfolio screen — real summary, honest about what's missing.
 *
 * Replaces the old hardcoded "Premier Plaza / Nexus Business Centre /
 * Riverside Towers" demo rows with nexus-claims-service's real
 * `GET /api/v1/leases/summary`. Leases got no write endpoints in the
 * write-endpoints round (no domain role holds `leases:create` in the RBAC
 * model as of 2026-09-30), so there is no per-property list to show yet —
 * only this tenant-wide aggregate. The screen states that plainly instead
 * of inventing rows to fill a table.
 */
import { ResourceScreen } from "@/components/dashboard/ResourceScreen";
import { Surface } from "@/components/ui/Surface";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { getLeaseSummary, type LeaseSummary } from "@/services/leases/leasesService";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function LeasesRoute() {
  const state = useAsyncResource<LeaseSummary>(getLeaseSummary);
  const { colors, isDark } = useEnterpriseTheme();

  return (
    <ResourceScreen
      title="Lease Portfolio"
      subtitle="Real portfolio totals, sourced live from nexus-claims-service — no demo rows."
      state={state}
      loadingLabel="Loading the lease summary..."
    >
      {(summary) => (
        <>
          <View style={styles.metrics}>
            <Surface style={styles.metric}>
              <StatusBadge label="Active leases" tone="blue" />
              <Text style={[styles.metricValue, { color: colors.text }]}>{summary.activeLeases}</Text>
            </Surface>
            <Surface style={styles.metric}>
              <StatusBadge label="Requiring inspection" tone="amber" />
              <Text style={[styles.metricValue, { color: colors.text }]}>{summary.leasesRequiringInspection}</Text>
            </Surface>
          </View>

          <Surface
            style={[
              styles.notice,
              { borderColor: colors.borderStrong, backgroundColor: isDark ? colors.hover : colors.background },
            ]}
          >
            <StatusBadge label="Not connected" tone="slate" />
            <Text style={[styles.reasonText, { color: colors.textMuted }]}>
              Leases has no write endpoints yet — no domain role in the current RBAC model holds
              leases:create, so there's no per-property ledger to list. These portfolio totals are real,
              but individual lease records aren't available until that's built.
            </Text>
          </Surface>
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
  notice: {
    gap: 8,
    borderWidth: 1,
  },
  reasonText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },
});
