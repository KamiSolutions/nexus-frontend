import { login as loginRequest, fetchCurrentUser, type LoginInput } from "@/services/auth/authService";
import type { EnterpriseRole } from "@/lib/permissions";
import * as storage from "@/lib/storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const TOKEN_STORAGE_KEY = "nexus.auth.token";

type SaaSUser = {
  id: string;
  name: string;
  email: string;
  role: EnterpriseRole;
  companyIds: string[];
};

type AuthContextValue = {
  /** null until a real sign-in has completed — no more hardcoded demo user. */
  user: SaaSUser | null;
  token: string | null;
  tenantId: string | null;
  scopes: string[];
  isSignedIn: boolean;
  /**
   * True only while a persisted token is being re-validated against
   * `GET /auth/me` on app launch (see the rehydration effect below).
   * Callers that gate navigation on `isSignedIn` (app/index.tsx,
   * (workspace)/_layout.tsx) must wait for this to go false first, or a
   * returning signed-in user briefly flashes the login screen.
   */
  isRehydrating: boolean;
  isAuthenticating: boolean;
  authError: string | null;
  signIn: (input: LoginInput) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<EnterpriseRole | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [scopes, setScopes] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isRehydrating, setIsRehydrating] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Rehydrate a persisted session on launch. A stored token is only ever
  // trusted once it's been re-validated live against nexus-identity-service
  // (`GET /auth/me`) — role/tenant/scopes come back fresh from the server,
  // never from a locally cached copy that could have gone stale (e.g. a
  // role change or revocation since the last sign-in). A missing token,
  // an expired/invalid one, or a failed request all land in the same
  // place: cleared storage, signed-out state — never a fabricated session.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const storedToken = await storage.getItem(TOKEN_STORAGE_KEY);
      if (!storedToken) {
        if (!cancelled) setIsRehydrating(false);
        return;
      }

      try {
        const me = await fetchCurrentUser(storedToken);
        if (cancelled) return;

        if (!me.role) {
          // Account exists but has no role assigned yet — not a valid
          // signed-in session for this app's purposes.
          await storage.removeItem(TOKEN_STORAGE_KEY);
          setIsRehydrating(false);
          return;
        }

        setToken(storedToken);
        setRole(me.role as EnterpriseRole);
        setTenantId(me.tenant_id);
        setScopes(me.scopes);
        setUserId(me.user_id);
      } catch {
        // Expired, revoked, or the gateway/identity-service is unreachable
        // — either way this token can't be trusted. Drop it rather than
        // retry silently; a genuine connectivity issue just means the user
        // signs in again once reachable, same as a first-time visitor.
        if (!cancelled) {
          await storage.removeItem(TOKEN_STORAGE_KEY);
        }
      } finally {
        if (!cancelled) setIsRehydrating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = async (input: LoginInput) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      // Real round-trip to nexus-identity-service's POST /auth/token — a
      // real password check now (see services/auth/authService.ts and
      // the identity service's app/store/user_store.py), not the earlier
      // role-selection stand-in.
      const result = await loginRequest(input);
      setToken(result.accessToken);
      setRole(result.role);
      setTenantId(result.tenantId);
      setScopes(result.scopes);
      setUserId(input.userId);
      await storage.setItem(TOKEN_STORAGE_KEY, result.accessToken);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign-in failed";
      setAuthError(message);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOut = () => {
    setToken(null);
    setRole(null);
    setTenantId(null);
    setScopes([]);
    setUserId(null);
    setAuthError(null);
    void storage.removeItem(TOKEN_STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(() => {
    const isSignedIn = Boolean(token && role && tenantId && userId);

    return {
      user: isSignedIn
        ? {
            id: userId as string,
            name: userId as string,
            email: userId as string,
            role: role as EnterpriseRole,
            companyIds: [],
          }
        : null,
      token,
      tenantId,
      scopes,
      isSignedIn,
      isRehydrating,
      isAuthenticating,
      authError,
      signIn,
      signOut,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, role, tenantId, scopes, userId, isRehydrating, isAuthenticating, authError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
