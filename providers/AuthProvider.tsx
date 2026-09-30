import { login as loginRequest, type LoginInput } from "@/services/auth/authService";
import type { EnterpriseRole } from "@/lib/permissions";
import * as storage from "@/lib/storage";
import React, { createContext, useContext, useMemo, useState } from "react";

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
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const signIn = async (input: LoginInput) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      // Real round-trip to nexus-identity-service's POST /auth/token — see
      // services/auth/authService.ts for why `role` is what's provided
      // rather than a password (no password store exists yet, P1).
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
      isAuthenticating,
      authError,
      signIn,
      signOut,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, role, tenantId, scopes, userId, isAuthenticating, authError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
