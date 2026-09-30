import { ModuleOverview } from "@/components/dashboard/ModuleOverview";
import React from "react";

// Fixes the project's second documented "fake integration" violation:
// this used to show "Xero — Connected, SharePoint — Pending, Microsoft
// 365 — Connected" — none of which are even the actual planned
// integrations, and all three were fabricated statuses with no backing
// connection at all. Per the project's core rule, every row below is the
// real, currently-planned integration, honestly marked "Not connected —
// demo mode" until nexus-financials-service actually talks to one of
// these providers (see nexus-portal-plan.md's P1 list — "one real
// integration adapter end-to-end" is the next milestone here).
export default function SettingsRoute() {
  return (
    <ModuleOverview
      title="Workspace Settings"
      subtitle="Company branding, tenant security, integration adapters, notification preferences, API keys, and data residency."
      metrics={[
        { label: "Integrations connected", value: "0", tone: "amber" },
        { label: "Security", value: "JWT (RBAC)", tone: "emerald" },
        { label: "Data region", value: "Africa", tone: "slate" },
      ]}
      rows={[
        { item: "Policy administration", provider: "easiPol", scope: "Policies", status: "Not connected — demo mode" },
        { item: "Premium collections", provider: "EasyPay / Pay@", scope: "Financials", status: "Not connected — demo mode" },
        { item: "Payment processing", provider: "Netcash / EasyDebit", scope: "Financials", status: "Not connected — demo mode" },
        { item: "Payroll", provider: "Sage / PaySpace", scope: "HR", status: "Not connected — demo mode" },
      ]}
    />
  );
}
