import { ModuleOverview } from "@/components/dashboard/ModuleOverview";
import { ModuleQuickLinks } from "@/components/dashboard/ModuleQuickLinks";
import React from "react";
import { View } from "react-native";

export default function HRRoute() {
  return (
    <View style={{ gap: 16 }}>
      <ModuleQuickLinks
        links={[
          { label: "Leave applications", href: "/(workspace)/hr/leave" },
          { label: "Contracts", href: "/(workspace)/hr/contracts" },
        ]}
      />
      <ModuleOverview
        title="HR Workspace"
        subtitle="Leave workflows, employee contracts, onboarding, policy acknowledgement, and workforce analytics."
        metrics={[
          { label: "Leave requests", value: "12", tone: "amber" },
          { label: "Contracts", value: "47", tone: "blue" },
          { label: "Onboarding", value: "9", tone: "emerald" },
        ]}
        rows={[
          { item: "Annual leave", employee: "Naledi Dube", company: "KFS", status: "Pending" },
          { item: "Contract renewal", employee: "Aviwe Maseko", company: "Group HQ", status: "Due soon" },
          { item: "Policy acknowledgement", employee: "Team Ops", company: "KFM", status: "88%" },
        ]}
      />
    </View>
  );
}
