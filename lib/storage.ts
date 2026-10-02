/**
 * Real cross-platform persistence for anything that needs to survive an
 * app reload — currently just the auth token (see `AuthProvider`).
 *
 * 2026-10-02: replaced the original in-memory-only `Map` (nothing ever
 * actually persisted — every reload silently signed the user out) with a
 * real store per platform:
 *  - Native (iOS/Android): `expo-secure-store`, backed by the OS
 *    Keychain/Keystore — the right place for a credential like an auth
 *    token, not AsyncStorage/SQLite (those aren't encrypted at rest).
 *  - Web: `localStorage` — the standard web pattern; browsers have no
 *    keychain equivalent, and this is the same trust boundary any other
 *    SPA storing a bearer token in the browser accepts.
 *
 * `expo-secure-store` is imported lazily (dynamic `import()`), the same
 * pattern `lib/offlineCache.ts` uses for `expo-sqlite`, so the native-only
 * module never has to resolve on web.
 */
import { Platform } from "react-native";

let secureStorePromise: Promise<typeof import("expo-secure-store")> | null = null;

function getSecureStore() {
  if (!secureStorePromise) {
    secureStorePromise = import("expo-secure-store");
  }
  return secureStorePromise;
}

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Storage unavailable (private browsing, disabled, quota) — sign-in
      // still works for this tab, it just won't survive a reload. No
      // different in practice from the old in-memory behaviour.
    }
    return;
  }

  const SecureStore = await getSecureStore();
  await SecureStore.setItemAsync(key, value);
}

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  const SecureStore = await getSecureStore();
  const value = await SecureStore.getItemAsync(key);
  return value ?? null;
}

export async function removeItem(key: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // no-op — nothing to clean up if storage was never writable.
    }
    return;
  }

  const SecureStore = await getSecureStore();
  await SecureStore.deleteItemAsync(key);
}
