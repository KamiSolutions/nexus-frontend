import { ModuleOverview } from "@/components/dashboard/ModuleOverview";
import { ModuleQuickLinks } from "@/components/dashboard/ModuleQuickLinks";
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
      <ModuleOverview
        title="Finance Operations"
        subtitle="Financial requisitions, loans, approvals, budgets, exports, audit trails, and approval pipelines."
        metrics={[
          { label: "Pending", value: "18", tone: "amber" },
          { label: "Approved MTD", value: "R4.8M", tone: "emerald" },
          { label: "Avg cycle", value: "1.8 days", tone: "blue" },
        ]}
        rows={[
          { item: "Office expansion capex", company: "Group HQ", amount: "R1.2M", status: "Review" },
          { item: "Vehicle service batch", company: "KFM", amount: "R186k", status: "Pending" },
          { item: "Payroll loan request", company: "KFS", amount: "R42k", status: "Approved" },
        ]}
      />
    </View>
  );
}
