import { ModuleOverview } from "@/components/dashboard/ModuleOverview";
import { ModuleQuickLinks } from "@/components/dashboard/ModuleQuickLinks";
import React from "react";
import { View } from "react-native";

export default function PoliciesRoute() {
  return (
    <View style={{ gap: 16 }}>
      <ModuleQuickLinks links={[{ label: "Submit a claim", href: "/(workspace)/policies/claim" }]} />
      <ModuleOverview
        title="Policies"
        subtitle="Insurance policies, coverage windows, renewal oversight, documents, and compliance controls."
        metrics={[
          { label: "Active", value: "26", tone: "emerald" },
          { label: "Renewals", value: "5", tone: "amber" },
          { label: "Coverage", value: "R92M", tone: "blue" },
        ]}
        rows={[
          { item: "Group liability", provider: "Santam", coverage: "R30M", status: "Active" },
          { item: "Fleet insurance", provider: "Hollard", coverage: "R18M", status: "Renewal" },
          { item: "Property cover", provider: "Old Mutual", coverage: "R44M", status: "Active" },
        ]}
      />
    </View>
  );
}
