/**
 * Real auth service — talks to nexus-identity-service's `POST /auth/token`
 * through the gateway.
 *
 * nexus-identity-service now has a real password store (bcrypt-hashed,
 * in-memory pending a real DB — see its app/store/user_store.py): a login
 * is `userId` + `password`, checked against a stored hash, and the
 * account's role/tenant come back from the server — never chosen by the
 * client. A wrong password or unknown userId gets a real failure here
 * (postJSON throws ApiError on the 401), never a fabricated success.
 */
import { getJSON, postJSON } from "@/lib/apiClient";
import type { EnterpriseRole } from "@/lib/permissions";

export type LoginInput = {
  userId: string;
  password: string;
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
    password: input.password,
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
