/**
 * Finance Operations landing screen.
 *
 * Previously showed hardcoded "18 pending / R4.8M approved MTD" metrics
 * and fake requisition rows. There is no backend entity for requisitions
 * yet (nexus-financials-service's write-endpoints round only built the
 * policies ledger — see the Policies screen for that real data), so this
 * now states that honestly instead of inventing numbers. The sub-routes
 * below (requisitions/pending/approved/loan) are real, ported legacy UI —
 * still reachable via the quick-links chips — just not backed by a
 * tenant-wide aggregate endpoint yet.
 */
import { ModuleQuickLinks } from "@/components/dashboard/ModuleQuickLinks";
import { NotAvailablePanel } from "@/components/dashboard/NotAvailablePanel";
import React from "react";
import { View } from "react-native";

export default function FinanceRoute() {
  return (
    <View style={{ gap: 16 }}>
      <ModuleQuickLinks
        links={[
          { label: "Requisitions", href: "/(workspace)/finance/requisitions" },
          { label: "Pending approvals", href: "/(workspace)/finance/pending" },
          { label: "Approved", href: "/(workspace)/finance/approved" },
          { label: "Loan applications", href: "/(workspace)/finance/loan" },
        ]}
      />
      <NotAvailablePanel
        title="Finance Operations"
        subtitle="Financial requisitions, loans, approvals, budgets, exports, audit trails, and approval pipelines."
        reason="There's no requisitions/approvals backend entity yet — only the real policy ledger (see Policies) has been built out. The sub-workflow pages above are real, ported screens; a tenant-wide requisitions summary isn't built yet."
      />
    </View>
  );
}
