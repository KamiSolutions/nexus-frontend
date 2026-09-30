/**
 * Reports screen — real report-topic catalogue.
 *
 * Replaces the old fabricated "Saved: 18 / Scheduled: 6 / Exports: 41"
 * counts and made-up rows with nexus-platform-service's real
 * `GET /api/v1/reports/available`. This lists *topics* that currently
 * have live data behind them, not downloadable files — formatted export
 * (PDF/Excel) is P2 and not built, and `note` says so; the UI shows that
 * note rather than implying every listed report can be downloaded today.
 */
import { ResourceScreen } from "@/components/dashboard/ResourceScreen";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { Surface } from "@/components/ui/Surface";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LABEL_BY_STATUS } from "@/lib/serviceStatus";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { getAvailableReports, type ReportsAvailable } from "@/services/platform/reportsService";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ReportRow = {
  title: string;
  module: string;
  status: string;
};

const columns: DataTableColumn<ReportRow>[] = [
  { key: "title", label: "Report", width: 260 },
  { key: "module", label: "Module", width: 140 },
  { key: "status", label: "Data status", width: 160 },
];

export default function ReportsRoute() {
  const state = useAsyncResource<ReportsAvailable>(getAvailableReports);
  const { colors } = useEnterpriseTheme();

  return (
    <ResourceScreen
      title="Reports"
      subtitle="Which report topics have real, live data behind them right now — not a list of downloadable files."
      state={state}
      loadingLabel="Checking which report topics have live data..."
    >
      {(data) => (
        <>
          <View style={styles.metrics}>
            <Surface style={styles.metric}>
              <StatusBadge label="Report topics" tone="blue" />
              <Text style={[styles.metricValue, { color: colors.text }]}>{data.reports.length}</Text>
            </Surface>
            <Surface style={styles.metric}>
              <StatusBadge label="With live data" tone="emerald" />
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {data.reports.filter((report) => report.dataStatus.status === "operational").length}
              </Text>
            </Surface>
          </View>

          <Text style={[styles.note, { color: colors.textMuted }]}>{data.note}</Text>

          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Available report topics</Text>
            <DataTable
              columns={columns}
              rows={data.reports.map((report) => ({
                title: report.title,
                module: report.module,
                status: LABEL_BY_STATUS[report.dataStatus.status],
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
  note: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
  },
});
