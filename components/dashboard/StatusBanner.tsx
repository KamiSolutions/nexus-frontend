/**
 * Single-status banner — Operational / Attention Required / Unknown, with
 * its stated reason. Used by screens whose backend response carries one
 * overall `ServiceStatus` for the data on the page (Companies), or one per
 * data source (Admin's tenant directory and audit log) — as opposed to
 * `DomainStatusList`, which renders a status per domain service
 * (Analytics/Reports' `domainStatus` array).
 */
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LABEL_BY_STATUS, TONE_BY_STATUS } from "@/lib/serviceStatus";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import type { ServiceStatus } from "@/services/platform/overviewService";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type StatusBannerProps = {
  label: string;
  status: ServiceStatus;
};

export function StatusBanner({ label, status }: StatusBannerProps) {
  const { colors } = useEnterpriseTheme();

  return (
    <View style={[styles.row, { borderColor: colors.border }]}>
      <View style={styles.text}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {status.detail ? <Text style={[styles.detail, { color: colors.textMuted }]}>{status.detail}</Text> : null}
      </View>
      <StatusBadge label={LABEL_BY_STATUS[status.status]} tone={TONE_BY_STATUS[status.status]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 10,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
  },
  detail: {
    fontSize: 12,
    fontWeight: "600",
  },
});
