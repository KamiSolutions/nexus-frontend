/**
 * Pure orchestration logic for "try live, fall back to cache" — no React,
 * no React Native, no expo-sqlite import here at all, deliberately, so
 * this one function can be unit-tested directly in plain Node (see
 * `scripts/__offline_cache_test__.mjs` run during this round's
 * verification) without needing a device, a simulator, or any native
 * module. `hooks/useCachedAsyncResource.ts` is the only caller in the real
 * app — it wires this up to React state and the real `resourceCache` from
 * `lib/offlineCache.ts`.
 *
 * Per the project's core rule ("never present mocked/demo data as if it
 * came from a real integration"), a cache hit is never presented as live:
 * the caller gets back `source: "cache"` plus the real `cachedAt`
 * timestamp from when that data was actually fetched, so the UI can show
 * an honest "you're viewing data from <time>" state instead of pretending
 * it's current.
 */

export type CacheEntry<T> = { data: T; cachedAt: string };

export interface ResourceCache {
  get<T>(key: string, tenantId: string): Promise<CacheEntry<T> | null>;
  set<T>(key: string, tenantId: string, data: T): Promise<void>;
}

export type ResolvedResource<T> =
  | { kind: "loaded"; data: T; source: "live" }
  | { kind: "loaded"; data: T; source: "cache"; cachedAt: string }
  | { kind: "error"; message: string };

/**
 * Calls `loader(token, tenantId)`. On success, writes the real result into
 * `cache` under `cacheKey`/`tenantId` and returns it as `source: "live"`.
 * On failure (network down, gateway unreachable, non-2xx — whatever
 * `loader` throws), looks up the same key in `cache`: a hit returns the
 * real previously-fetched data as `source: "cache"` with its real
 * `cachedAt`; a miss returns the same honest error `loader` threw, exactly
 * as `useAsyncResource` already does today — no new failure mode is
 * introduced for a tenant/key that was never successfully loaded before.
 */
export async function resolveCachedResource<T>(
  loader: () => Promise<T>,
  cache: ResourceCache,
  cacheKey: string,
  tenantId: string,
): Promise<ResolvedResource<T>> {
  try {
    const data = await loader();
    await cache.set(cacheKey, tenantId, data);
    return { kind: "loaded", data, source: "live" };
  } catch (error) {
    const cached = await cache.get<T>(cacheKey, tenantId);
    if (cached) {
      return { kind: "loaded", data: cached.data, source: "cache", cachedAt: cached.cachedAt };
    }
    return {
      kind: "error",
      message: error instanceof Error ? error.message : "Could not reach the gateway.",
    };
  }
}
