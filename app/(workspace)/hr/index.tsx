/**
 * HR Workspace landing screen.
 *
 * Previously showed hardcoded "12 leave requests / 47 contracts" metrics
 * and fake rows. There is no backend entity for leave requests or
 * contracts yet (nexus-hr-service's write-endpoints round only built the
 * employee ledger — see the Employees & Access screen for that real
 * data), so this now states that honestly instead of inventing numbers.
 * The sub-routes below (leave/contracts) are real, ported legacy UI —
 * still reachable via the quick-links chips — just not backed by a
 * tenant-wide aggregate endpoint yet.
 */
import { ModuleQuickLinks } from "@/components/dashboard/ModuleQuickLinks";
import { NotAvailablePanel } from "@/components/dashboard/NotAvailablePanel";
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
      <NotAvailablePanel
        title="HR Workspace"
        subtitle="Leave workflows, employee contracts, onboarding, policy acknowledgement, and workforce analytics."
        reason="There's no leave-request or contracts backend entity yet — only the real employee ledger (see Employees & Access) has been built out. The sub-workflow pages above are real, ported screens; a tenant-wide leave/contracts summary isn't built yet."
      />
    </View>
  );
}
