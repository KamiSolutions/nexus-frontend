/**
 * Command Centre status panel.
 *
 * Replaces ExecutiveDashboard's old "Activity feed" (a hardcoded string
 * array presented as if it were live) and "AI operating insight" (a
 * hardcoded, canned sentence) — both flagged as the project's two known
 * "fake integration" violations. This panel instead calls
 * nexus-platform-service's real `GET /api/v1/overview/status` through the
 * gateway and renders exactly what comes back: Operational / Attention
 * Required / Unknown, per service, with the stated reason when something
 * isn't healthy. If the call itself fails (platform-service down, no
 * gateway configured, network error), that failure is shown honestly too
 * — this never falls back to a "looks fine" placeholder.
 */
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Surface } from "@/components/ui/Surface";
import { useAuth } from "@/providers/AuthProvider";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import {
  getOverviewStatus,
  type OverviewStatus,
  type ServiceStatusLevel,
} from "@/services/platform/overviewService";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "loaded"; data: OverviewStatus };

const TONE_BY_STATUS: Record<ServiceStatusLevel, "emerald" | "rose" | "slate"> = {
  operational: "emerald",
  attention_required: "rose",
  unknown: "slate",
};

const LABEL_BY_STATUS: Record<ServiceStatusLevel, string> = {
  operational: "Operational",
  attention_required: "Attention required",
  unknown: "Unknown",
};

export function CommandCentreStatus() {
  const { colors } = useEnterpriseTheme();
  const { token, tenantId } = useAuth();
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  const load = useCallback(async () => {
    if (!token || !tenantId) {
      setState({ kind: "error", message: "Not signed in — no token to call the Command Centre with." });
      return;
    }

    setState({ kind: "loading" });
    try {
      const data = await getOverviewStatus(token, tenantId);
      setState({ kind: "loaded", data });
    } catch (error) {
      setState({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not reach nexus-platform-service's Overview endpoint.",
      });
    }
  }, [token, tenantId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Surface style={styles.panel}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Service health (Command Centre)</Text>
        <TouchableOpacity onPress={() => void load()}>
          <Text style={[styles.refresh, { color: colors.blue }]}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {state.kind === "loading" && (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.blue} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>Checking every service...</Text>
        </View>
      )}

      {state.kind === "error" && (
        <View style={[styles.errorBox, { borderColor: colors.rose }]}>
          <StatusBadge label="Command Centre unreachable" tone="rose" />
          <Text style={[styles.errorText, { color: colors.textMuted }]}>{state.message}</Text>
        </View>
      )}

      {state.kind === "loaded" && (
        <View style={styles.list}>
          {state.data.services.map((service) => (
            <View key={service.serviceName} style={[styles.row, { borderBottomColor: colors.border }]}>
              <View style={styles.rowText}>
                <Text style={[styles.serviceName, { color: colors.text }]}>{service.serviceName}</Text>
                {service.detail ? (
                  <Text style={[styles.detail, { color: colors.textMuted }]}>{service.detail}</Text>
                ) : null}
              </View>
              <StatusBadge label={LABEL_BY_STATUS[service.status]} tone={TONE_BY_STATUS[service.status]} />
            </View>
          ))}
          <Text style={[styles.generatedAt, { color: colors.textMuted }]}>
            Last checked: {new Date(state.data.generatedAt).toLocaleTimeString()}
          </Text>
        </View>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
  },
  refresh: {
    fontSize: 13,
    fontWeight: "800",
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
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  errorText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  list: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "800",
  },
  detail: {
    fontSize: 12,
    fontWeight: "600",
  },
  generatedAt: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
});
