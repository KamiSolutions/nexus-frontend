/**
 * Admin screen — RBAC reference (still the frontend's own source of
 * truth, `lib/permissions.ts`, which doesn't vary per tenant) plus real,
 * live platform-health data from nexus-platform-service's
 * `GET /api/v1/admin/summary`: the tenant directory, the audit log, and
 * the cross-service health rollup, each with its own independent status —
 * one of the three being unreachable never blanks out or fakes the other
 * two.
 */
import { ResourceScreen } from "@/components/dashboard/ResourceScreen";
import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { Surface } from "@/components/ui/Surface";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { roleLabels, rolePermissions } from "@/lib/permissions";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { getAdminSummary, type AdminSummary } from "@/services/platform/adminService";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type RoleRow = {
  name: string;
  key: string;
  permissions: number;
  scope: string;
};

const roleColumns: DataTableColumn<RoleRow>[] = [
  { key: "name", label: "Role", width: 200 },
  { key: "key", label: "Key", width: 180 },
  { key: "permissions", label: "Permissions", width: 130 },
  { key: "scope", label: "Scope", width: 120 },
];

type AuditRow = {
  action: string;
  resourceType: string;
  actorUserId: string;
  occurredAt: string;
};

const auditColumns: DataTableColumn<AuditRow>[] = [
  { key: "action", label: "Action", width: 160 },
  { key: "resourceType", label: "Resource", width: 160 },
  { key: "actorUserId", label: "Actor", width: 180 },
  { key: "occurredAt", label: "Occurred at", width: 200 },
];

export default function AdminRoute() {
  const state = useAsyncResource<AdminSummary>(getAdminSummary);
  const { colors } = useEnterpriseTheme();

  return (
    <ResourceScreen
      title="Roles & Permissions"
      subtitle="Enterprise RBAC reference, plus real tenant directory, audit activity, and platform health."
      state={state}
      loadingLabel="Loading platform-wide admin summary..."
    >
      {(data) => (
        <>
          <View style={styles.metrics}>
            <Surface style={styles.metric}>
              <StatusBadge label="Roles" tone="blue" />
              <Text style={[styles.metricValue, { color: colors.text }]}>{Object.keys(roleLabels).length}</Text>
            </Surface>
            <Surface style={styles.metric}>
              <StatusBadge label="Tenants" tone="emerald" />
              <Text style={[styles.metricValue, { color: colors.text }]}>{data.totalTenants ?? "Unknown"}</Text>
            </Surface>
            <Surface style={styles.metric}>
              <StatusBadge label="Services operational" tone="emerald" />
              <Text style={[styles.metricValue, { color: colors.text }]}>{data.servicesOperational}</Text>
            </Surface>
            <Surface style={styles.metric}>
              <StatusBadge label="Services needing attention" tone="rose" />
              <Text style={[styles.metricValue, { color: colors.text }]}>{data.servicesAttentionRequired}</Text>
            </Surface>
          </View>

          <StatusBanner label="Tenant directory" status={data.tenantsStatus} />
          <StatusBanner label="Audit log" status={data.auditStatus} />

          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Roles &amp; permission counts</Text>
            <DataTable
              columns={roleColumns}
              rows={Object.entries(roleLabels).map(([role, label]) => ({
                name: label,
                key: role,
                permissions: rolePermissions[role as keyof typeof rolePermissions].length,
                scope: role === "SUPER_ADMIN" ? "Platform" : "Tenant",
              }))}
            />
          </View>

          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent audit activity {data.totalAuditEvents !== null ? `(${data.totalAuditEvents} total)` : ""}
            </Text>
            {data.recentAuditEvents.length > 0 ? (
              <DataTable
                columns={auditColumns}
                rows={data.recentAuditEvents.map((event) => ({
                  action: event.action,
                  resourceType: event.resourceType,
                  actorUserId: event.actorUserId,
                  occurredAt: new Date(event.occurredAt).toLocaleString(),
                }))}
              />
            ) : (
              <Text style={[styles.empty, { color: colors.textMuted }]}>
                No recent audit events — see the audit log status above.
              </Text>
            )}
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
  empty: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
});
