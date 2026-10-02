/**
 * Shared loading/error/loaded state for a screen that calls a real backend
 * endpoint through nexus-api-gateway.
 *
 * Factored out of `CommandCentreStatus.tsx`'s original inline pattern so
 * the Companies/Admin/Settings/Analytics/Reports screens (all added
 * 2026-09-30 to consume nexus-platform-service's new BFF endpoints) don't
 * each re-implement the same loading/error/retry plumbing. Per the
 * project's core rule ("never present mocked/demo data as if it came from
 * a real integration"), a failed call surfaces here as an honest `error`
 * state — it never falls back to stale or fabricated data.
 *
 * `source`/`cachedAt` on the `loaded` variant (2026-10-02): added so this
 * same state type also covers `useCachedAsyncResource`'s offline-first
 * result (see that hook) without `ResourceScreen` needing a second state
 * type. Every screen still using this hook directly (Companies, Admin,
 * Settings, Analytics, Reports — no offline cache yet) simply never sets
 * `source`, so nothing changes for them.
 */
import { useAuth } from "@/providers/AuthProvider";
import { useCallback, useEffect, useState } from "react";

export type AsyncResourceState<T> =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "loaded"; data: T; source?: "live" | "cache"; cachedAt?: string };

/**
 * Calls `loader(token, tenantId)` once on mount (and whenever `deps`
 * change), and exposes `reload` for a manual retry/refresh. Requires a
 * signed-in session — `useAuth`'s `token`/`tenantId` are null until a real
 * sign-in has completed (see AuthProvider), and this hook reports that
 * honestly as an error state rather than skipping the call silently.
 */
export function useAsyncResource<T>(
  loader: (token: string, tenantId: string) => Promise<T>,
  deps: unknown[] = [],
): AsyncResourceState<T> & { reload: () => void } {
  const { token, tenantId } = useAuth();
  const [state, setState] = useState<AsyncResourceState<T>>({ kind: "loading" });

  const load = useCallback(() => {
    if (!token || !tenantId) {
      setState({ kind: "error", message: "Not signed in — no token to call this endpoint with." });
      return;
    }

    setState({ kind: "loading" });
    (async () => {
      try {
        const data = await loader(token, tenantId);
        setState({ kind: "loaded", data });
      } catch (error) {
        setState({
          kind: "error",
          message: error instanceof Error ? error.message : "Could not reach the gateway.",
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tenantId, ...deps]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load } as AsyncResourceState<T> & { reload: () => void };
}
