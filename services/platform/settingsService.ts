/**
 * Settings/Integrations client — calls nexus-platform-service's real
 * `GET /api/v1/settings/integrations` through the gateway.
 *
 * Replaces the Settings screen's own hand-written integrations array
 * (which was already honest — "Not connected — demo mode" for all four —
 * but duplicated the list in frontend source) with the backend's copy, so
 * there's exactly one place this list is maintained. The `status` field's
 * only possible value is `"not_connected"`, mirroring the backend
 * schema's `Literal["not_connected"]` typing: there is no code path here
 * that can render a fabricated "Connected" badge.
 */
import { getJSON } from "@/lib/apiClient";

export type IntegrationCategory = "policy_administration" | "payments" | "payroll";

export type IntegrationStatus = {
  integrationId: string;
  name: string;
  category: IntegrationCategory;
  status: "not_connected";
  detail: string;
};

export type IntegrationsSettings = {
  generatedAt: string;
  note: string;
  integrations: IntegrationStatus[];
};

type IntegrationStatusBody = {
  integration_id: string;
  name: string;
  category: IntegrationCategory;
  status: "not_connected";
  detail: string;
};

type IntegrationsSettingsResponseBody = {
  generated_at: string;
  note: string;
  integrations: IntegrationStatusBody[];
};

export async function getIntegrationsSettings(token: string, tenantId: string): Promise<IntegrationsSettings> {
  const body = await getJSON<IntegrationsSettingsResponseBody>("/api/v1/settings/integrations", {
    token,
    tenantId,
  });

  return {
    generatedAt: body.generated_at,
    note: body.note,
    integrations: body.integrations.map((integration) => ({
      integrationId: integration.integration_id,
      name: integration.name,
      category: integration.category,
      status: integration.status,
      detail: integration.detail,
    })),
  };
}
