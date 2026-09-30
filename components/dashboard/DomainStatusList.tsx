/**
 * Per-domain status list — Analytics/Reports call one endpoint that fans
 * out across financials/hr/fleet/cases/claims/leases, and each domain can
 * independently be Operational, Attention Required (unreachable/error), or
 * Unknown (the caller's token genuinely lacks that domain's scope). This
 * renders every entry in a response's `domainStatus` array honestly —
 * never collapsing them into one summary badge, since a caller who can
 * see `financials` but not `hr` needs to see that distinction.
 */
import { Surface } from "@/components/ui/Surface";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LABEL_BY_STATUS, TONE_BY_STATUS } from "@/lib/serviceStatus";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import type { ServiceStatus } from "@/services/platform/overviewService";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type DomainStatusListProps = {
  title: string;
  statuses: ServiceStatus[];
};

export function DomainStatusList({ title, statuses }: DomainStatusListProps) {
  const { colors } = useEnterpriseTheme();

  return (
    <Surface style={styles.panel}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={styles.list}>
        {statuses.map((status) => (
          <View key={status.serviceName} style={[styles.row, { borderBottomColor: colors.border }]}>
            <View style={styles.rowText}>
              <Text style={[styles.serviceName, { color: colors.text }]}>{status.serviceName}</Text>
              {status.detail ? <Text style={[styles.detail, { color: colors.textMuted }]}>{status.detail}</Text> : null}
            </View>
            <StatusBadge label={LABEL_BY_STATUS[status.status]} tone={TONE_BY_STATUS[status.status]} />
          </View>
        ))}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
  },
  list: {
    gap: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  serviceName: {
    fontSize: 13,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  detail: {
    fontSize: 12,
    fontWeight: "600",
  },
});
