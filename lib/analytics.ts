import { enterprisePalette } from "./constants";

export const executiveKpis = [
  { label: "Group revenue", value: "R43.9M", delta: "+12.8%", tone: "blue" },
  { label: "Approval cycle", value: "1.8 days", delta: "-24%", tone: "emerald" },
  { label: "Fleet uptime", value: "96.4%", delta: "+3.1%", tone: "cyan" },
  { label: "Open risk items", value: "18", delta: "-7", tone: "amber" },
];

export const revenueTrend = [
  { month: "Jan", value: 31 },
  { month: "Feb", value: 35 },
  { month: "Mar", value: 34 },
  { month: "Apr", value: 39 },
  { month: "May", value: 42 },
  { month: "Jun", value: 44 },
];

export const approvalPipeline = [
  { label: "Finance", count: 18, color: enterprisePalette.blue },
  { label: "HR", count: 7, color: enterprisePalette.emerald },
  { label: "Claims", count: 11, color: enterprisePalette.amber },
  { label: "Leases", count: 4, color: enterprisePalette.violet },
];

// Note: a hardcoded `activityFeed` array used to live here, presented in
// ExecutiveDashboard as a live "Activity feed" — one of the project's two
// documented "fake integration" violations. It's been removed rather than
// left unused: ExecutiveDashboard now renders real data from
// nexus-platform-service's Overview endpoint instead (see
// components/dashboard/CommandCentreStatus.tsx). The KPI/revenue/pipeline
// figures above are still illustrative placeholders (no financials-service
// aggregation endpoint feeds them yet) — P1 to wire up for real.
