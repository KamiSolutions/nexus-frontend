/**
 * Loading / error / loaded wrapper for a Command Centre screen backed by a
 * real endpoint (see `hooks/useAsyncResource.ts`). Renders the module
 * header (title/subtitle/eyebrow, matching `ModuleOverview`'s look) plus
 * one of: a spinner, an honest error box with a Retry button, or the
 * caller's content once data has actually loaded. No branch here ever
 * substitutes placeholder data for a failed call.
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

export function ResourceScreen<T>({ title, subtitle, state, loadingLabel, children }: ResourceScreenProps<T>) {
  const { colors, isDark } = useEnterpriseTheme();
  const { activeCompany } = useTenant();

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
  retry: {
    fontSize: 13,
    fontWeight: "800",
  },
});
