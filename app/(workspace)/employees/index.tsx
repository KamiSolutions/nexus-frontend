/**
 * Employees & Access screen — real employee directory.
 *
 * Replaces the old hardcoded "John Moyo / Sarah Ncube / Peter Dlamini"
 * demo rows with nexus-hr-service's real `GET /api/v1/hr/employees` (the
 * same table the write-endpoints round's POST/PUT/DELETE operate on).
 * Metrics are computed from the real rows returned, never a fabricated
 * figure.
 */
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { ResourceScreen } from "@/components/dashboard/ResourceScreen";
import { Surface } from "@/components/ui/Surface";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useCachedAsyncResource } from "@/hooks/useCachedAsyncResource";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { listEmployees, type EmployeeRecord } from "@/services/hr/hrService";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type EmployeeRow = {
  fullName: string;
  department: string;
  jobTitle: string;
  status: string;
};

const columns: DataTableColumn<EmployeeRow>[] = [
  { key: "fullName", label: "Name", width: 220 },
  { key: "department", label: "Department", width: 180 },
  { key: "jobTitle", label: "Job title", width: 180 },
  { key: "status", label: "Status", width: 120 },
];

export default function EmployeesRoute() {
  const state = useCachedAsyncResource<EmployeeRecord[]>("employees", listEmployees);
  const { colors } = useEnterpriseTheme();

  return (
    <ResourceScreen
      title="Employees & Access"
      subtitle="A tenant-scoped employee directory, sourced live from nexus-hr-service — no demo rows."
      state={state}
      loadingLabel="Loading the employee directory..."
    >
      {(employees) => {
        const activeCount = employees.filter((employee) => employee.status === "active").length;
        const onLeaveCount = employees.filter((employee) => employee.status === "on_leave").length;
        const departmentCount = new Set(employees.map((employee) => employee.department)).size;

        return (
          <>
            <View style={styles.metrics}>
              <Surface style={styles.metric}>
                <StatusBadge label="Employees" tone="blue" />
                <Text style={[styles.metricValue, { color: colors.text }]}>{employees.length}</Text>
              </Surface>
              <Surface style={styles.metric}>
                <StatusBadge label="Active" tone="emerald" />
                <Text style={[styles.metricValue, { color: colors.text }]}>{activeCount}</Text>
              </Surface>
              <Surface style={styles.metric}>
                <StatusBadge label="On leave" tone="amber" />
                <Text style={[styles.metricValue, { color: colors.text }]}>{onLeaveCount}</Text>
              </Surface>
              <Surface style={styles.metric}>
                <StatusBadge label="Departments" tone="slate" />
                <Text style={[styles.metricValue, { color: colors.text }]}>{departmentCount}</Text>
              </Surface>
            </View>

            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Employee directory</Text>
              {employees.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                  No employee records yet for this tenant.
                </Text>
              ) : (
                <DataTable
                  columns={columns}
                  rows={employees.map((employee) => ({
                    fullName: employee.fullName,
                    department: employee.department,
                    jobTitle: employee.jobTitle,
                    status: employee.status,
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
