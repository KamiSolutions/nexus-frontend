/**
 * Real auth service — talks to nexus-identity-service's `POST /auth/token`
 * through the gateway.
 *
 * This replaces the old `getDemoSession()` stub that returned a hardcoded
 * user with no network call at all. It is still a simplified login: the
 * backend has no password store yet (see nexus-identity-service's
 * `schemas/login.py` docstring and the project's P1 list), so there is no
 * password to check here either — `role` selects which EnterpriseRole's
 * scopes to mint. What IS real: a genuine HTTP round-trip to
 * nexus-identity-service, a genuine signed JWT with genuine scopes, and a
 * genuine failure (network error, service down, bad request) surfaced to
 * the caller — never a fabricated "always succeeds" login like the
 * previous UI had.
 */
import { getJSON, postJSON } from "@/lib/apiClient";
import type { EnterpriseRole } from "@/lib/permissions";

export type LoginInput = {
  userId: string;
  role: EnterpriseRole;
  tenantId?: string;
};

export type LoginResult = {
  accessToken: string;
  tokenType: string;
  role: EnterpriseRole;
  tenantId: string;
  scopes: string[];
};

type LoginResponseBody = {
  access_token: string;
  token_type: string;
  role: EnterpriseRole;
  tenant_id: string;
  scopes: string[];
};

export async function login(input: LoginInput): Promise<LoginResult> {
  const body = await postJSON<LoginResponseBody>("/api/v1/auth/token", {
    user_id: input.userId,
    role: input.role,
    tenant_id: input.tenantId,
  });

  return {
    accessToken: body.access_token,
    tokenType: body.token_type,
    role: body.role,
    tenantId: body.tenant_id,
    scopes: body.scopes,
  };
}

type CurrentUserBody = {
  user_id: string;
  tenant_id: string;
  scopes: string[];
  role: string | null;
};

/** Introspects the caller's own token via `GET /auth/me` — used to validate a stored token is still live. */
export function fetchCurrentUser(token: string): Promise<CurrentUserBody> {
  return getJSON<CurrentUserBody>("/api/v1/auth/me", { token });
}
