/**
 * Claims client — calls nexus-claims-service's real
 * `GET /api/v1/claims/claims` through the gateway.
 *
 * New file: the Claims Center screen (app/(workspace)/claims/index.tsx)
 * previously hardcoded fake CLM-number rows with no service client at
 * all. Wires to the real claim ledger built in the write-endpoints round
 * (app/services/claims/claim_write_service.py on the backend).
 */
import { getJSON } from "@/lib/apiClient";

export type ClaimStatus = "submitted" | "under_review" | "approved" | "rejected" | "paid";

export type ClaimRecord = {
  id: string;
  tenantId: string;
  claimNumber: string;
  claimantName: string;
  claimValue: number;
  status: ClaimStatus;
  createdAt: string;
  updatedAt: string;
};

type ClaimRecordBody = {
  id: string;
  tenant_id: string;
  claim_number: string;
  claimant_name: string;
  claim_value: number;
  status: ClaimStatus;
  created_at: string;
  updated_at: string;
};

export async function listClaims(token: string, tenantId: string): Promise<ClaimRecord[]> {
  const body = await getJSON<ClaimRecordBody[]>("/api/v1/claims/claims", { token, tenantId });

  return body.map((claim) => ({
    id: claim.id,
    tenantId: claim.tenant_id,
    claimNumber: claim.claim_number,
    claimantName: claim.claimant_name,
    claimValue: claim.claim_value,
    status: claim.status,
    createdAt: claim.created_at,
    updatedAt: claim.updated_at,
  }));
}
