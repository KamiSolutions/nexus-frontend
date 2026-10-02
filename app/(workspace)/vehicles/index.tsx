/**
 * Fleet Tracking screen — real vehicle ledger.
 *
 * Replaces the old hardcoded "Toyota Quantum / Ford Raptor / Mercedes-Benz
 * V-Class" demo rows with nexus-fleet-service's real
 * `GET /api/v1/vehicles/vehicles` (the same table the write-endpoints
 * round's POST/PUT/DELETE operate on). Metrics are computed from the real
 * rows returned, never a fabricated figure.
 */
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import { ModuleQuickLinks } from "@/components/dashboard/ModuleQuickLinks";
import { ResourceScreen } from "@/components/dashboard/ResourceScreen";
import { Surface } from "@/components/ui/Surface";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAsyncResource } from "@/hooks/useAsyncResource";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { listVehicles, type VehicleRecord } from "@/services/vehicles/vehicleService";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type VehicleRow = {
  makeModel: string;
  registrationNumber: string;
  vehicleClass: string;
  status: string;
};

const columns: DataTableColumn<VehicleRow>[] = [
  { key: "makeModel", label: "Vehicle", width: 220 },
  { key: "registrationNumber", label: "Registration", width: 160 },
  { key: "vehicleClass", label: "Class", width: 160 },
  { key: "status", label: "Status", width: 140 },
];

export default function VehiclesRoute() {
  const state = useAsyncResource<VehicleRecord[]>(listVehicles);
  const { colors } = useEnterpriseTheme();

  return (
    <View style={{ gap: 16 }}>
      <ModuleQuickLinks links={[{ label: "Maintenance records", href: "/(workspace)/vehicles/maintenance" }]} />
      <ResourceScreen
        title="Fleet Tracking"
        subtitle="Real vehicle records, sourced live from nexus-fleet-service — no demo rows."
        state={state}
        loadingLabel="Loading fleet records..."
      >
        {(vehicles) => {
          const inService = vehicles.filter((vehicle) => vehicle.status === "in_service").length;
          const inMaintenance = vehicles.filter((vehicle) => vehicle.status === "in_maintenance").length;

          return (
            <>
              <View style={styles.metrics}>
                <Surface style={styles.metric}>
                  <StatusBadge label="Vehicles" tone="blue" />
                  <Text style={[styles.metricValue, { color: colors.text }]}>{vehicles.length}</Text>
                </Surface>
                <Surface style={styles.metric}>
                  <StatusBadge label="In service" tone="emerald" />
                  <Text style={[styles.metricValue, { color: colors.text }]}>{inService}</Text>
                </Surface>
                <Surface style={styles.metric}>
                  <StatusBadge label="In maintenance" tone="amber" />
                  <Text style={[styles.metricValue, { color: colors.text }]}>{inMaintenance}</Text>
                </Surface>
              </View>

              <View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Fleet records</Text>
                {vehicles.length === 0 ? (
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    No vehicle records yet for this tenant.
                  </Text>
                ) : (
                  <DataTable
                    columns={columns}
                    rows={vehicles.map((vehicle) => ({
                      makeModel: vehicle.makeModel,
                      registrationNumber: vehicle.registrationNumber,
                      vehicleClass: vehicle.vehicleClass,
                      status: vehicle.status,
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
