import { KpiCard } from "@/components/cards/KpiCard";
import { MiniBarChart } from "@/components/charts/MiniBarChart";
import { CommandCentreStatus } from "@/components/dashboard/CommandCentreStatus";
import { DataTable } from "@/components/tables/DataTable";
import { Surface } from "@/components/ui/Surface";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { approvalPipeline, executiveKpis, revenueTrend } from "@/lib/analytics";
import { useTenant } from "@/providers/TenantProvider";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const approvalRows = [
  { item: "Fleet insurance renewal", company: "Kusile Fleet Management", owner: "Claims", status: "Pending" },
  { item: "Capex requisition R1.2M", company: "Group HQ", owner: "Finance", status: "Review" },
  { item: "Lease extension", company: "Summit Life Operations", owner: "Legal", status: "Due soon" },
  { item: "New employee contracts", company: "Kusile Financial Services", owner: "HR", status: "Approved" },
];

export function ExecutiveDashboard() {
  const { colors, isDark } = useEnterpriseTheme();
  const { activeCompany, companies, tenant } = useTenant();

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={[styles.eyebrow, { color: colors.blue }]}>Enterprise command center</Text>
          <Text style={[styles.title, { color: colors.text }]}>Group performance, approvals, and operating risk in one workspace.</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {tenant.groupName} is operating across {companies.length} company workspaces. Current scope: {activeCompany.name}.
          </Text>
        </View>
        <Surface style={[styles.heroPanel, isDark && { backgroundColor: colors.elevated, borderColor: colors.borderStrong }]}>
          <Text style={[styles.panelLabel, { color: colors.textMuted }]}>Tenant architecture</Text>
          <Text style={[styles.panelValue, { color: colors.text }]}>Isolated workspaces</Text>
          <View style={styles.badgeRow}>
            <StatusBadge label={tenant.plan} tone="blue" />
            <StatusBadge label={tenant.dataRegion} tone="slate" />
          </View>
        </Surface>
      </View>

      <View style={styles.kpiGrid}>
        {executiveKpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} tone={kpi.tone as any} />
        ))}
      </View>

      <View style={styles.twoColumn}>
        <Surface style={styles.chartPanel}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Monthly revenue trend</Text>
              <Text style={[styles.sectionSub, { color: colors.textMuted }]}>Consolidated company performance</Text>
            </View>
            <StatusBadge label="+12.8% YoY" tone="emerald" />
          </View>
          <MiniBarChart data={revenueTrend} />
        </Surface>

        <Surface style={styles.pipelinePanel}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Approval pipelines</Text>
          <View style={styles.pipelineList}>
            {approvalPipeline.map((item) => (
              <View key={item.label} style={styles.pipelineItem}>
                <View style={[styles.pipelineDot, { backgroundColor: item.color }]} />
                <Text style={[styles.pipelineLabel, { color: colors.text }]}>{item.label}</Text>
                <Text style={[styles.pipelineCount, { color: colors.textMuted }]}>{item.count}</Text>
              </View>
            ))}
          </View>
        </Surface>
      </View>

      <View style={styles.twoColumn}>
        <View style={styles.tableWrap}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending executive actions</Text>
          <DataTable
            columns={[
              { key: "item", label: "Action", width: 210 },
              { key: "company", label: "Company", width: 220 },
              { key: "owner", label: "Owner", width: 120 },
              { key: "status", label: "Status", width: 130 },
            ]}
            rows={approvalRows}
          />
        </View>

        <View style={styles.commandCentreWrap}>
          {/* Real cross-service health data from nexus-platform-service —
              replaces the old hardcoded "Activity feed" and fabricated
              "AI operating insight" panels that used to live here. */}
          <CommandCentreStatus />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    paddingBottom: 32,
  },
  hero: {
    flexDirection: "row",
    gap: 18,
    flexWrap: "wrap",
  },
  heroCopy: {
    flex: 1,
    minWidth: 280,
    gap: 10,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    maxWidth: 920,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
  },
  subtitle: {
    maxWidth: 780,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "600",
  },
  heroPanel: {
    width: 300,
    gap: 10,
  },
  panelLabel: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  panelValue: {
    fontSize: 24,
    fontWeight: "900",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  twoColumn: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },
  chartPanel: {
    flex: 2,
    minWidth: 310,
    gap: 18,
  },
  pipelinePanel: {
    flex: 1,
    minWidth: 280,
    gap: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
  },
  sectionSub: {
    fontSize: 13,
    fontWeight: "700",
  },
  pipelineList: {
    gap: 12,
  },
  pipelineItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pipelineDot: {
    width: 10,
    height: 10,
    borderRadius: 99,
  },
  pipelineLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
  },
  pipelineCount: {
    fontSize: 14,
    fontWeight: "900",
  },
  tableWrap: {
    flex: 2,
    minWidth: 320,
  },
  commandCentreWrap: {
    flex: 1,
    minWidth: 280,
  },
});
