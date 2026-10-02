/**
 * Policies client — calls nexus-financials-service's real
 * `GET /api/v1/financials/policies` through the gateway.
 *
 * Replaces the old `listRequisitions()` demo stub (hardcoded requisition
 * rows that nothing in app/(workspace)/finance actually imported — the
 * screen inlined its own fake data instead) with the platform's one real
 * financials write-path: the policies ledger built in the write-endpoints
 * round (app/services/financials/policy_write_service.py on the backend).
 * Used by the Policies screen (app/(workspace)/policies/index.tsx) —
 * "Finance Operations" itself (requisitions/approvals/loans) has no
 * backend entity yet, see that screen's own honest "not available" panel.
 */
import { getJSON } from "@/lib/apiClient";

export type PolicyStatus = "active" | "lapsed" | "cancelled";

export type PolicyRecord = {
  id: string;
  tenantId: string;
  providerName: string;
  policyNumber: string;
  holderName: string;
  monthlyPremium: number;
  status: PolicyStatus;
  createdAt: string;
  updatedAt: string;
};

type PolicyRecordBody = {
  id: string;
  tenant_id: string;
  provider_name: string;
  policy_number: string;
  holder_name: string;
  monthly_premium: number;
  status: PolicyStatus;
  created_at: string;
  updated_at: string;
};

export async function listPolicies(token: string, tenantId: string): Promise<PolicyRecord[]> {
  const body = await getJSON<PolicyRecordBody[]>("/api/v1/financials/policies", { token, tenantId });

  return body.map((policy) => ({
    id: policy.id,
    tenantId: policy.tenant_id,
    providerName: policy.provider_name,
    policyNumber: policy.policy_number,
    holderName: policy.holder_name,
    monthlyPremium: policy.monthly_premium,
    status: policy.status,
    createdAt: policy.created_at,
    updatedAt: policy.updated_at,
  }));
}
