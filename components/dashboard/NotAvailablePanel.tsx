/**
 * Honest "no backend service yet" panel — used in place of ModuleOverview's
 * old hardcoded fake metrics/rows on screens that have genuinely nothing to
 * fetch: Billing and Notifications (no backend service exists anywhere in
 * the polyrepo for either), and the Finance/HR workspace landing pages
 * (the requisition/leave-request workflows they used to show fake numbers
 * for have no backing entity yet — only their real ported sub-routes do,
 * reachable via the ModuleQuickLinks chips above this panel).
 *
 * Per the project's core rule ("never present mocked/demo data as if it
 * came from a real integration"), this replaces fabricated numbers with a
 * stated, honest reason — never a vague "Coming soon" gloss that still
 * implies something real is almost there.
 */
import { Surface } from "@/components/ui/Surface";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useTenant } from "@/providers/TenantProvider";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type NotAvailablePanelProps = {
  title: string;
  subtitle: string;
  reason: string;
  children?: React.ReactNode;
};

export function NotAvailablePanel({ title, subtitle, reason, children }: NotAvailablePanelProps) {
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

      {children}

      <Surface
        style={[
          styles.notice,
          { borderColor: colors.borderStrong, backgroundColor: isDark ? colors.hover : colors.background },
        ]}
      >
        <StatusBadge label="Not connected" tone="slate" />
        <Text style={[styles.reasonText, { color: colors.textMuted }]}>{reason}</Text>
      </Surface>
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
  notice: {
    gap: 8,
    borderWidth: 1,
  },
  reasonText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },
});
