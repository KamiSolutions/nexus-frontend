/**
 * Settings screen — real integrations list.
 *
 * Previously fixed (2026-09-30, earlier round) to stop showing fabricated
 * "Xero — Connected" style statuses, but the honest replacement list was
 * still hand-written directly in this file. This now calls
 * nexus-platform-service's real `GET /api/v1/settings/integrations`, so
 * the list lives in exactly one place (the backend) instead of being
 * duplicated here. Every integration's `status` is `"not_connected"` —
 * the backend schema makes any other value a type error until a real
 * integration adapter exists.
 */
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { ResourceScreen } from "@/components/dashboard/ResourceScreen";
import { Surface } from "@/components/ui/Surface";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { getIntegrationsSettings, type IntegrationsSettings } from "@/services/platform/settingsService";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type IntegrationRow = {
  name: string;
  category: string;
  status: string;
  detail: string;
};

const columns: DataTableColumn<IntegrationRow>[] = [
  { key: "name", label: "Integration", width: 220 },
  { key: "category", label: "Category", width: 180 },
  { key: "status", label: "Status", width: 160 },
  { key: "detail", label: "Detail", width: 260 },
];

const CATEGORY_LABEL: Record<string, string> = {
  policy_administration: "Policy administration",
  payments: "Payments",
  payroll: "Payroll",
};

export default function SettingsRoute() {
  const state = useAsyncResource<IntegrationsSettings>(getIntegrationsSettings);
  const { colors } = useEnterpriseTheme();

  return (
    <ResourceScreen
      title="Workspace Settings"
      subtitle="Company branding, tenant security, integration adapters, notification preferences, API keys, and data residency."
      state={state}
      loadingLabel="Loading integration status..."
    >
      {(data) => (
        <>
          <View style={styles.metrics}>
            <Surface style={styles.metric}>
              <StatusBadge label="Integrations connected" tone="amber" />
              <Text style={[styles.metricValue, { color: colors.text }]}>0</Text>
            </Surface>
            <Surface style={styles.metric}>
              <StatusBadge label="Security" tone="emerald" />
              <Text style={[styles.metricValue, { color: colors.text }]}>JWT (RBAC)</Text>
            </Surface>
            <Surface style={styles.metric}>
              <StatusBadge label="Data region" tone="slate" />
              <Text style={[styles.metricValue, { color: colors.text }]}>Africa</Text>
            </Surface>
          </View>

          <Text style={[styles.note, { color: colors.textMuted }]}>{data.note}</Text>

          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Integration adapters</Text>
            <DataTable
              columns={columns}
              rows={data.integrations.map((integration) => ({
                name: integration.name,
                category: CATEGORY_LABEL[integration.category] ?? integration.category,
                status: "Not connected — demo mode",
                detail: integration.detail,
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
