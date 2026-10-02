/**
 * Offline-first sibling of `useAsyncResource` (see that file) for the five
 * list screens with a real, cacheable backend entity: Policies, Employees,
 * Vehicles, Claims, Leases. Same external shape (`loading`/`error`/`loaded`
 * + `reload`) so `ResourceScreen` renders both without a special case,
 * except the `loaded` variant now optionally carries `source: "cache"` +
 * the real `cachedAt` timestamp when the data shown is the last
 * successfully-fetched copy rather than a fresh live response — see
 * `lib/resolveCachedResource.ts` for the actual fallback logic (tested
 * directly, without React, in this round's verification) and
 * `lib/offlineCache.ts` for the real on-device SQLite store it reads from.
 *
 * Scope note (2026-10-02): read-only. A cache miss on a failed call still
 * surfaces the same honest error `useAsyncResource` always has — this
 * never invents data for a tenant/key with nothing cached yet.
 */
import { useAuth } from "@/providers/AuthProvider";
import { resourceCache } from "@/lib/offlineCache";
import { resolveCachedResource } from "@/lib/resolveCachedResource";
import { useCallback, useEffect, useState } from "react";
import type { AsyncResourceState } from "@/hooks/useAsyncResource";

export function useCachedAsyncResource<T>(
  cacheKey: string,
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
      const resolved = await resolveCachedResource<T>(
        () => loader(token, tenantId),
        resourceCache,
        cacheKey,
        tenantId,
      );
      setState(resolved);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tenantId, cacheKey, ...deps]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load } as AsyncResourceState<T> & { reload: () => void };
}
