/**
 * Command Centre / Overview client — calls nexus-platform-service's
 * `GET /api/v1/overview/status` through the gateway.
 *
 * This is what makes the Command Centre honest: the backend genuinely
 * fans out over HTTP to every domain service's `/health` endpoint (see
 * nexus-platform-service's `overview_service.py`), so what comes back here
 * is real reachability, not a decorative "all systems operational" badge.
 * A service that's down comes back as `attention_required` with a stated
 * reason; this client does not reinterpret or soften that.
 */
import { getJSON } from "@/lib/apiClient";

export type ServiceStatusLevel = "operational" | "attention_required" | "unknown";

export type ServiceStatus = {
  serviceName: string;
  status: ServiceStatusLevel;
  detail: string | null;
};

export type OverviewStatus = {
  generatedAt: string;
  services: ServiceStatus[];
};

type ServiceStatusBody = {
  service_name: string;
  status: ServiceStatusLevel;
  detail: string | null;
};

type OverviewResponseBody = {
  generated_at: string;
  services: ServiceStatusBody[];
};

export async function getOverviewStatus(token: string, tenantId: string): Promise<OverviewStatus> {
  const body = await getJSON<OverviewResponseBody>("/api/v1/overview/status", { token, tenantId });

  return {
    generatedAt: body.generated_at,
    services: body.services.map((service) => ({
      serviceName: service.service_name,
      status: service.status,
      detail: service.detail,
    })),
  };
}
