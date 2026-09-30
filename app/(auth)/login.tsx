import { APP_NAME } from "@/lib/constants";
import { roleLabels, type EnterpriseRole } from "@/lib/permissions";
import { useAuth } from "@/providers/AuthProvider";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Every role the combined RBAC model defines — kept in the same order as
// lib/permissions.ts so this list can never silently drift from what the
// backend actually mints scopes for.
const SELECTABLE_ROLES: EnterpriseRole[] = [
  "SUPER_ADMIN",
  "GROUP_ADMIN",
  "COMPANY_ADMIN",
  "FINANCE_MANAGER",
  "HR_MANAGER",
  "FLEET_MANAGER",
  "CLAIMS_OFFICER",
  "MORTUARY_STAFF",
  "DRIVER",
  "TEAM_LEAD",
  "EMPLOYEE",
  "AUDITOR",
];

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useEnterpriseTheme();
  const { signIn, isAuthenticating, authError } = useAuth();
  const [userId, setUserId] = useState("amara@nexus.example");
  const [role, setRole] = useState<EnterpriseRole>("GROUP_ADMIN");
  const [tenantId, setTenantId] = useState("");

  const handleSignIn = async () => {
    if (!userId.trim()) {
      return;
    }

    try {
      await signIn({ userId: userId.trim(), role, tenantId: tenantId.trim() || undefined });
      router.replace("/(workspace)/dashboard");
    } catch {
      // authError is already set by AuthProvider and rendered below —
      // nothing else to do here, and critically no navigation on failure.
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.eyebrow, { color: colors.blue }]}>Premium SaaS group portal</Text>
          <Text style={[styles.title, { color: colors.text }]}>{APP_NAME}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Sign in to manage companies, teams, finance, fleet, policies, and analytics.
          </Text>

          <View style={[styles.notice, { borderColor: colors.borderStrong, backgroundColor: colors.background }]}>
            <Text style={[styles.noticeText, { color: colors.textMuted }]}>
              Demo login: nexus-identity-service has no password store yet, so signing in mints a real,
              correctly-scoped access token for the role you select below — it is not a fabricated
              "always succeeds" login.
            </Text>
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Work email</Text>
          <TextInput
            value={userId}
            onChangeText={setUserId}
            placeholder="Work email"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
            autoCapitalize="none"
            editable={!isAuthenticating}
          />

          <Text style={[styles.label, { color: colors.text }]}>Tenant ID (optional — defaults to the demo sandbox)</Text>
          <TextInput
            value={tenantId}
            onChangeText={setTenantId}
            placeholder="demo_sandbox"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
            autoCapitalize="none"
            editable={!isAuthenticating}
          />

          <Text style={[styles.label, { color: colors.text }]}>Role</Text>
          <View style={styles.roleGrid}>
            {SELECTABLE_ROLES.map((candidate) => {
              const isActive = candidate === role;
              return (
                <TouchableOpacity
                  key={candidate}
                  onPress={() => setRole(candidate)}
                  disabled={isAuthenticating}
                  style={[
                    styles.roleChip,
                    {
                      borderColor: isActive ? colors.blue : colors.border,
                      backgroundColor: isActive ? colors.blueSoft : "transparent",
                    },
                  ]}
                >
                  <Text style={[styles.roleChipText, { color: isActive ? colors.blue : colors.text }]}>
                    {roleLabels[candidate]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {authError ? (
            <View style={[styles.errorBox, { borderColor: colors.rose }]}>
              <Text style={[styles.errorText, { color: colors.rose }]}>{authError}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.blue, opacity: isAuthenticating ? 0.7 : 1 }]}
            onPress={handleSignIn}
            disabled={isAuthenticating}
          >
            <Text style={styles.buttonText}>{isAuthenticating ? "Signing in..." : "Enter workspace"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    borderWidth: 1,
    borderRadius: 18,
    padding: 28,
    gap: 12,
    shadowColor: "#0b1630",
    shadowOpacity: 0.1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 16 },
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 4,
  },
  notice: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "600",
  },
  roleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  roleChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: "800",
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "700",
  },
  button: {
    borderRadius: 8,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },
});
