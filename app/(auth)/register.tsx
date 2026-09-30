import { APP_NAME } from "@/lib/constants";
import { register } from "@/services/auth/authService";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { ApiError } from "@/lib/apiClient";
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

/**
 * Real account creation — calls nexus-identity-service's `POST
 * /auth/register` (see services/auth/authService.ts). Every new account
 * gets the lowest-privilege EMPLOYEE role and the demo tenant; there's no
 * client-side role picker here because the backend won't honor one — see
 * that endpoint's docstring. On success this hands off to the onboarding
 * screen with the real created-account details, not fabricated ones.
 */
export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useEnterpriseTheme();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = userId.trim().length >= 3 && password.length >= 8 && password === confirmPassword;

  const handleRegister = async () => {
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register({ userId: userId.trim(), password });
      router.replace({
        pathname: "/(auth)/onboarding",
        params: { userId: result.userId, role: result.role, tenantId: result.tenantId },
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.eyebrow, { color: colors.blue }]}>{APP_NAME}</Text>
          <Text style={[styles.title, { color: colors.text }]}>Create an account</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            New accounts start as an Employee on the demo tenant — an admin promotes you to a specific role
            later (that admin flow isn't built yet).
          </Text>

          <Text style={[styles.label, { color: colors.text }]}>Work email</Text>
          <TextInput
            value={userId}
            onChangeText={setUserId}
            placeholder="you@nexus.example"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
            autoCapitalize="none"
            editable={!isSubmitting}
          />

          <Text style={[styles.label, { color: colors.text }]}>Password (min. 8 characters)</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
            autoCapitalize="none"
            secureTextEntry
            editable={!isSubmitting}
          />

          <Text style={[styles.label, { color: colors.text }]}>Confirm password</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
            autoCapitalize="none"
            secureTextEntry
            editable={!isSubmitting}
          />

          {error ? (
            <View style={[styles.errorBox, { borderColor: colors.rose }]}>
              <Text style={[styles.errorText, { color: colors.rose }]}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.blue, opacity: isSubmitting || !canSubmit ? 0.6 : 1 }]}
            onPress={handleRegister}
            disabled={isSubmitting || !canSubmit}
          >
            <Text style={styles.buttonText}>{isSubmitting ? "Creating account..." : "Create account"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow} onPress={() => router.replace("/(auth)/login")}>
            <Text style={[styles.linkText, { color: colors.blue }]}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 20 },
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
  eyebrow: { fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  title: { fontSize: 30, fontWeight: "900" },
  subtitle: { fontSize: 14, lineHeight: 20, fontWeight: "600", marginBottom: 4 },
  label: { fontSize: 12, fontWeight: "800", textTransform: "uppercase", marginTop: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "600",
  },
  errorBox: { borderWidth: 1, borderRadius: 8, padding: 10 },
  errorText: { fontSize: 13, fontWeight: "700" },
  button: {
    borderRadius: 8,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "900" },
  linkRow: { alignItems: "center", marginTop: 6 },
  linkText: { fontSize: 13, fontWeight: "800" },
});
