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

export type RegisterInput = {
  userId: string;
  password: string;
};

export type RegisterResult = {
  userId: string;
  role: EnterpriseRole;
  tenantId: string;
};

type RegisterResponseBody = {
  user_id: string;
  role: EnterpriseRole;
  tenant_id: string;
};

/**
 * Real account creation against `POST /auth/register`. There is no
 * client-supplied role or tenant here — the backend always assigns
 * EMPLOYEE + the demo tenant (see nexus-identity-service's
 * app/schemas/registration.py) — and it never mints a token, so signing in
 * after registering is a genuine second step through the real login
 * check, not a session handed out for free.
 */
export async function register(input: RegisterInput): Promise<RegisterResult> {
  const body = await postJSON<RegisterResponseBody>("/api/v1/auth/register", {
    user_id: input.userId,
    password: input.password,
  });

  return { userId: body.user_id, role: body.role, tenantId: body.tenant_id };
}

export type PasswordResetRequestResult = {
  resetToken: string | null;
  note: string;
};

type PasswordResetRequestResponseBody = {
  status: string;
  reset_token: string | null;
  note: string;
};

/**
 * Calls `POST /auth/password-reset/request`. There is no email service
 * wired up yet (P1), so the backend returns the real reset token directly
 * in this response rather than emailing it — `note` carries that honest
 * caveat, and the forgot-password screen shows it verbatim rather than
 * pretending an email went out.
 */
export async function requestPasswordReset(userId: string): Promise<PasswordResetRequestResult> {
  const body = await postJSON<PasswordResetRequestResponseBody>("/api/v1/auth/password-reset/request", {
    user_id: userId,
  });
  return { resetToken: body.reset_token, note: body.note };
}

/**
 * Calls `POST /auth/password-reset/confirm`. The token is single-use and
 * expires after 15 minutes server-side — an invalid, expired, or reused
 * token surfaces as a real `ApiError` (400), never a silent success.
 */
export async function confirmPasswordReset(input: {
  userId: string;
  resetToken: string;
  newPassword: string;
}): Promise<void> {
  await postJSON("/api/v1/auth/password-reset/confirm", {
    user_id: input.userId,
    reset_token: input.resetToken,
    new_password: input.newPassword,
  });
}
