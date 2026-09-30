import { ModuleOverview } from "@/components/dashboard/ModuleOverview";
import { ModuleQuickLinks } from "@/components/dashboard/ModuleQuickLinks";
import React from "react";
import { View } from "react-native";

export default function VehiclesRoute() {
  return (
    <View style={{ gap: 16 }}>
      <ModuleQuickLinks links={[{ label: "Maintenance records", href: "/(workspace)/vehicles/maintenance" }]} />
      <ModuleOverview
        title="Fleet Tracking"
        subtitle="Vehicle inventory, assignments, telematics readiness, maintenance schedules, licensing, and insurance tracking."
        metrics={[
          { label: "Vehicles", value: "42", tone: "blue" },
          { label: "Uptime", value: "96.4%", tone: "emerald" },
          { label: "Service due", value: "6", tone: "amber" },
        ]}
        rows={[
          { name: "Toyota Quantum", plate: "GP 321-765", mileage: "152,300 km", status: "Service due" },
          { name: "Ford Raptor", plate: "ND 987-654", mileage: "42,000 km", status: "Assigned" },
          { name: "Mercedes-Benz V-Class", plate: "CW 654-321", mileage: "63,400 km", status: "Available" },
        ]}
      />
    </View>
  );
}
