/**
 * Loading / error / loaded wrapper for a Command Centre screen backed by a
 * real endpoint (see `hooks/useAsyncResource.ts`). Renders the module
 * header (title/subtitle/eyebrow, matching `ModuleOverview`'s look) plus
 * one of: a spinner, an honest error box with a Retry button, or the
 * caller's content once data has actually loaded. No branch here ever
 * substitutes placeholder data for a failed call.
 *
 * Cache banner (2026-10-02): when `state.source === "cache"` — set only by
 * `useCachedAsyncResource` (see that hook and `lib/resolveCachedResource.ts`)
 * — this renders an explicit "Showing cached data" banner with the real
 * `cachedAt` timestamp instead of a live-data badge, so cached data is
 * never presented as if it just loaded from the gateway.
 */
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useTenant } from "@/providers/TenantProvider";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import type { AsyncResourceState } from "@/hooks/useAsyncResource";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ResourceScreenProps<T> = {
  title: string;
  subtitle: string;
  state: AsyncResourceState<T> & { reload: () => void };
  loadingLabel: string;
  children: (data: T) => React.ReactNode;
};

function formatCachedAt(cachedAt: string): string {
  const then = new Date(cachedAt);
  if (Number.isNaN(then.getTime())) {
    return cachedAt;
  }
  const minutesAgo = Math.max(0, Math.round((Date.now() - then.getTime()) / 60000));
  if (minutesAgo < 1) return "moments ago";
  if (minutesAgo < 60) return `${minutesAgo} min ago`;
  const hoursAgo = Math.round(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo}h ago`;
  return then.toLocaleString();
}

export function ResourceScreen<T>({ title, subtitle, state, loadingLabel, children }: ResourceScreenProps<T>) {
  const { colors, isDark } = useEnterpriseTheme();
  const { activeCompany } = useTenant();
  const isCached = state.kind === "loaded" && state.source === "cache";

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.eyebrow, { color: activeCompany.brandColor }]}>{activeCompany.name}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
        </View>
        <StatusBadge label="Tenant scoped" tone="blue" />
      </View>

      {state.kind === "loading" && (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.blue} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>{loadingLabel}</Text>
        </View>
      )}

      {state.kind === "error" && (
        <View style={[styles.errorBox, { borderColor: colors.rose, backgroundColor: isDark ? colors.hover : colors.background }]}>
          <StatusBadge label="Could not load" tone="rose" />
          <Text style={[styles.errorText, { color: colors.textMuted }]}>{state.message}</Text>
          <TouchableOpacity onPress={state.reload}>
            <Text style={[styles.retry, { color: colors.blue }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {state.kind === "loaded" && isCached && (
        <View style={[styles.cacheBanner, { borderColor: colors.amber, backgroundColor: isDark ? colors.hover : colors.background }]}>
          <StatusBadge label="Offline — showing cached data" tone="amber" />
          <Text style={[styles.cacheText, { color: colors.textMuted }]}>
            Last updated {formatCachedAt((state as { cachedAt: string }).cachedAt)}. Reconnect and retry for current data.
          </Text>
          <TouchableOpacity onPress={state.reload}>
            <Text style={[styles.retry, { color: colors.blue }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {state.kind === "loaded" && children(state.data)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 18,
  },
  headerText: {
    flex: 1,
    gap: 8,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "900",
  },
  subtitle: {
    maxWidth: 760,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "600",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: "700",
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    gap: 8,
    alignItems: "flex-start",
  },
  errorText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  cacheBanner: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    gap: 8,
    alignItems: "flex-start",
  },
  cacheText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  retry: {
    fontSize: 13,
    fontWeight: "800",
  },
});
