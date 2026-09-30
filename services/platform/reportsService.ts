/**
 * Reports client — calls nexus-platform-service's real
 * `GET /api/v1/reports/available` through the gateway.
 *
 * Honesty note carried over from the backend schema: this lists report
 * *topics* that currently have real, live data behind them (reusing the
 * same per-domain reachability/scope logic as the Analytics endpoint) —
 * it is not a list of downloadable files. Formatted export (PDF/Excel via
 * ReportLab) is P2 and not built; `note` says so plainly, and the UI must
 * show that note rather than implying every listed report can be
 * downloaded today.
 */
import { getJSON } from "@/lib/apiClient";
import type { ServiceStatus } from "@/services/platform/overviewService";

export type AvailableReport = {
  reportId: string;
  title: string;
  module: string;
  description: string;
  dataStatus: ServiceStatus;
};

export type ReportsAvailable = {
  generatedAt: string;
  tenantId: string;
  note: string;
  reports: AvailableReport[];
};

type AvailableReportBody = {
  report_id: string;
  title: string;
  module: string;
  description: string;
  data_status: { service_name: string; status: ServiceStatus["status"]; detail: string | null };
};

type ReportsAvailableResponseBody = {
  generated_at: string;
  tenant_id: string;
  note: string;
  reports: AvailableReportBody[];
};

export async function getAvailableReports(token: string, tenantId: string): Promise<ReportsAvailable> {
  const body = await getJSON<ReportsAvailableResponseBody>("/api/v1/reports/available", { token, tenantId });

  return {
    generatedAt: body.generated_at,
    tenantId: body.tenant_id,
    note: body.note,
    reports: body.reports.map((report) => ({
      reportId: report.report_id,
      title: report.title,
      module: report.module,
      description: report.description,
      dataStatus: {
        serviceName: report.data_status.service_name,
        status: report.data_status.status,
        detail: report.data_status.detail,
      },
    })),
  };
}
