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

// Must match nexus-identity-service's app/store/user_store.py exactly —
// that's where these demo accounts are actually seeded (one per
// EnterpriseRole, sharing this same password). Quick-fill chips below set
// both fields from this list so every role can still be exercised without
// a real signup/onboarding flow yet (P1) — but the request that goes out
// is a genuine user_id + password login, not a role selector.
const DEMO_PASSWORD = "NexusDemo!2026";

const DEMO_ROLES: EnterpriseRole[] = [
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

function demoUserId(role: EnterpriseRole): string {
  return `demo.${role.toLowerCase()}@nexus.demo`;
}

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useEnterpriseTheme();
  const { signIn, isAuthenticating, authError } = useAuth();
  const [userId, setUserId] = useState(demoUserId("GROUP_ADMIN"));
  const [password, setPassword] = useState(DEMO_PASSWORD);

  const handleSignIn = async () => {
    if (!userId.trim() || !password) {
      return;
    }

    try {
      await signIn({ userId: userId.trim(), password });
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
              Real password check: nexus-identity-service verifies this against a stored bcrypt hash and rejects a
              wrong password or unknown account with a real error. There's no signup flow yet, so every account below
              is a seeded demo user (one per role) sharing the password shown — pick a quick-fill chip or type your
              own account's user ID and password.
            </Text>
          </View>

          <Text style={[styles.label, { color: colors.text }]}>User ID</Text>
          <TextInput
            value={userId}
            onChangeText={setUserId}
            placeholder="you@nexus.example"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
            autoCapitalize="none"
            editable={!isAuthenticating}
          />

          <Text style={[styles.label, { color: colors.text }]}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
            autoCapitalize="none"
            secureTextEntry
            editable={!isAuthenticating}
          />

          <Text style={[styles.label, { color: colors.text }]}>Quick-fill a demo account ({DEMO_PASSWORD})</Text>
          <View style={styles.roleGrid}>
            {DEMO_ROLES.map((candidate) => {
              const isActive = userId === demoUserId(candidate);
              return (
                <TouchableOpacity
                  key={candidate}
                  onPress={() => {
                    setUserId(demoUserId(candidate));
                    setPassword(DEMO_PASSWORD);
                  }}
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
