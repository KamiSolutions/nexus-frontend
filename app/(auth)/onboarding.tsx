import { APP_NAME } from "@/lib/constants";
import { roleLabels, rolePermissions, type EnterpriseRole } from "@/lib/permissions";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * Real post-registration welcome screen — shows the account that was
 * actually just created (its real role and tenant, passed through as
 * navigation params from the register screen), not a scripted "let's set
 * up your workspace" wizard that doesn't correspond to anything the
 * backend does yet. There's no company/team-setup step to build here
 * (that's an admin flow, not built — see the register endpoint's
 * docstring), so this stays a short, honest landing point rather than
 * inventing steps.
 */
export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useEnterpriseTheme();
  const params = useLocalSearchParams<{ userId?: string; role?: string; tenantId?: string }>();

  const userId = params.userId ?? "";
  const role = (params.role as EnterpriseRole) ?? "EMPLOYEE";
  const tenantId = params.tenantId ?? "demo_sandbox";
  const modules = Array.from(
    new Set((rolePermissions[role] ?? []).map((permission) => permission.split(":")[0])),
  );

  const handleContinue = () => {
    router.replace({ pathname: "/(auth)/login", params: { initialUserId: userId } });
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.eyebrow, { color: colors.blue }]}>{APP_NAME}</Text>
        <Text style={[styles.title, { color: colors.text }]}>Your account is ready</Text>

        <View style={[styles.summaryRow, { borderColor: colors.border }]}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Account</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{userId}</Text>
        </View>
        <View style={[styles.summaryRow, { borderColor: colors.border }]}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Role</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{roleLabels[role]}</Text>
        </View>
        <View style={[styles.summaryRow, { borderColor: colors.border }]}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Tenant</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{tenantId}</Text>
        </View>

        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          As a {roleLabels[role]}, you'll have access to: {modules.join(", ")}.
        </Text>

        <View style={[styles.notice, { borderColor: colors.borderStrong, backgroundColor: colors.background }]}>
          <Text style={[styles.noticeText, { color: colors.textMuted }]}>
            Role and tenant changes (e.g. joining a specific company, or being promoted to a manager role) are an
            admin action that isn't built yet — for now every new account starts here.
          </Text>
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.blue }]} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue to sign in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  card: {
    width: "100%",
    maxWidth: 480,
    borderWidth: 1,
    borderRadius: 18,
    padding: 28,
    gap: 10,
  },
  eyebrow: { fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  title: { fontSize: 28, fontWeight: "900", marginBottom: 4 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  summaryLabel: { fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  summaryValue: { fontSize: 14, fontWeight: "700" },
  subtitle: { fontSize: 14, lineHeight: 20, fontWeight: "600", marginTop: 8 },
  notice: { borderWidth: 1, borderRadius: 8, padding: 12, marginTop: 4 },
  noticeText: { fontSize: 12, lineHeight: 18, fontWeight: "600" },
  button: {
    borderRadius: 8,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "900" },
});
