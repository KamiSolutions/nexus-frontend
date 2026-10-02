/**
 * Real, on-device SQLite-backed cache for "read-only offline" list screens
 * (Policies, Employees, Vehicles, Claims, Leases — see each screen's use of
 * `hooks/useCachedAsyncResource.ts`). Scope decided 2026-10-02: read-only
 * caching only, no offline write queue yet (see plan doc's Offline-first
 * frontend section) — a record created/edited/deleted still requires a
 * live connection.
 *
 * Storage choice: `expo-sqlite` (decided over MMKV) — a real queryable
 * table is the natural fit for cached rows, and keeps the door open for an
 * offline write queue later without a second storage mechanism.
 *
 * Web caveat, deliberate: `expo-sqlite`'s synchronous API
 * (`openDatabaseSync`) has no supported web implementation as of Expo SDK
 * 54 — web would need the separate async wa-sqlite/WASM path, a bigger
 * lift not justified for this round, since the actual offline-first need
 * here is field staff (DRIVER/MORTUARY_STAFF roles) on a phone, not a desk
 * user in a browser who is rarely genuinely offline. Rather than silently
 * doing nothing or crashing, `resourceCache` on web is a `NoopResourceCache`
 * that honestly reports every lookup as a miss — same "never fake it"
 * principle this project applies to integrations, applied here to storage:
 * a screen running on web that loses its connection still shows the same
 * honest error state it always did, it just never shows stale-but-labeled
 * cached data the way the native app now can. Revisit if/when real device
 * testing (flagged as not done this round — see plan doc) surfaces a need
 * to support offline web too.
 */
import { Platform } from "react-native";
import type { CacheEntry, ResourceCache } from "@/lib/resolveCachedResource";

const DB_NAME = "nexus_offline_cache.db";
const TABLE = "cached_resources";

class SqliteResourceCache implements ResourceCache {
  private dbPromise: Promise<import("expo-sqlite").SQLiteDatabase> | null = null;

  private async getDb() {
    if (!this.dbPromise) {
      this.dbPromise = (async () => {
        // Lazy import: keeps the native module out of the web bundle's
        // module graph entirely, rather than relying on tree-shaking.
        const SQLite = await import("expo-sqlite");
        const db = await SQLite.openDatabaseAsync(DB_NAME);
        await db.execAsync(
          `CREATE TABLE IF NOT EXISTS ${TABLE} (
             cache_key TEXT NOT NULL,
             tenant_id TEXT NOT NULL,
             payload TEXT NOT NULL,
             cached_at TEXT NOT NULL,
             PRIMARY KEY (cache_key, tenant_id)
           );`,
        );
        return db;
      })();
    }
    return this.dbPromise;
  }

  async get<T>(key: string, tenantId: string): Promise<CacheEntry<T> | null> {
    const db = await this.getDb();
    const row = await db.getFirstAsync<{ payload: string; cached_at: string }>(
      `SELECT payload, cached_at FROM ${TABLE} WHERE cache_key = ? AND tenant_id = ?;`,
      [key, tenantId],
    );
    if (!row) {
      return null;
    }
    try {
      return { data: JSON.parse(row.payload) as T, cachedAt: row.cached_at };
    } catch {
      // A corrupted/unparseable cache row is treated as a miss, never a
      // crash — the caller falls through to its own honest error state.
      return null;
    }
  }

  async set<T>(key: string, tenantId: string, data: T): Promise<void> {
    const db = await this.getDb();
    const cachedAt = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO ${TABLE} (cache_key, tenant_id, payload, cached_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(cache_key, tenant_id) DO UPDATE SET payload = excluded.payload, cached_at = excluded.cached_at;`,
      [key, tenantId, JSON.stringify(data), cachedAt],
    );
  }
}

class NoopResourceCache implements ResourceCache {
  async get<T>(): Promise<CacheEntry<T> | null> {
    return null;
  }
  async set(): Promise<void> {
    // Intentionally does nothing on web — see module docstring.
  }
}

export const resourceCache: ResourceCache = Platform.OS === "web" ? new NoopResourceCache() : new SqliteResourceCache();
