import { APP_NAME } from "@/lib/constants";
import { ApiError } from "@/lib/apiClient";
import { confirmPasswordReset, requestPasswordReset } from "@/services/auth/authService";
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

/**
 * Real two-step password reset — calls nexus-identity-service's
 * `POST /auth/password-reset/request` then `POST /auth/password-reset/confirm`
 * (see services/auth/authService.ts). There is no email service wired up
 * yet (P1): rather than faking a "check your email" message, step 1 shows
 * the real single-use token the backend returns directly, with the same
 * honest note the backend sends. The reset mechanism itself is real — a
 * genuine, time-limited, single-use token — only the delivery channel is
 * a stand-in, and that limitation is stated on screen, not hidden.
 */
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useEnterpriseTheme();

  const [step, setStep] = useState<"request" | "confirm" | "done">("request");
  const [userId, setUserId] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async () => {
    if (!userId.trim()) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await requestPasswordReset(userId.trim());
      setNote(result.note);
      if (result.resetToken) {
        setResetToken(result.resetToken);
      }
      setStep("confirm");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not request a reset token.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    setError(null);
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmPasswordReset({ userId: userId.trim(), resetToken: resetToken.trim(), newPassword });
      setStep("done");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reset the password — the token may be invalid or expired.");
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
          <Text style={[styles.title, { color: colors.text }]}>Reset your password</Text>

          {step === "request" ? (
            <>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Enter your account's user ID to request a reset token.
              </Text>
              <TextInput
                value={userId}
                onChangeText={setUserId}
                placeholder="you@nexus.example"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                autoCapitalize="none"
                editable={!isSubmitting}
              />
              {error ? (
                <View style={[styles.errorBox, { borderColor: colors.rose }]}>
                  <Text style={[styles.errorText, { color: colors.rose }]}>{error}</Text>
                </View>
              ) : null}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.blue, opacity: isSubmitting || !userId.trim() ? 0.6 : 1 }]}
                onPress={handleRequest}
                disabled={isSubmitting || !userId.trim()}
              >
                <Text style={styles.buttonText}>{isSubmitting ? "Requesting..." : "Request reset token"}</Text>
              </TouchableOpacity>
            </>
          ) : null}

          {step === "confirm" ? (
            <>
              <View style={[styles.notice, { borderColor: colors.borderStrong, backgroundColor: colors.background }]}>
                <Text style={[styles.noticeText, { color: colors.textMuted }]}>{note}</Text>
              </View>

              <Text style={[styles.label, { color: colors.text }]}>Reset token</Text>
              <TextInput
                value={resetToken}
                onChangeText={setResetToken}
                placeholder="Reset token"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, styles.mono, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                autoCapitalize="none"
                editable={!isSubmitting}
              />

              <Text style={[styles.label, { color: colors.text }]}>New password (min. 8 characters)</Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New password"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                autoCapitalize="none"
                secureTextEntry
                editable={!isSubmitting}
              />

              <Text style={[styles.label, { color: colors.text }]}>Confirm new password</Text>
              <TextInput
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                placeholder="Confirm new password"
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
                style={[styles.button, { backgroundColor: colors.blue, opacity: isSubmitting || !resetToken.trim() ? 0.6 : 1 }]}
                onPress={handleConfirm}
                disabled={isSubmitting || !resetToken.trim()}
              >
                <Text style={styles.buttonText}>{isSubmitting ? "Resetting..." : "Reset password"}</Text>
              </TouchableOpacity>
            </>
          ) : null}

          {step === "done" ? (
            <>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Your password has been updated. Sign in with your new password.
              </Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.blue }]}
                onPress={() => router.replace({ pathname: "/(auth)/login", params: { initialUserId: userId.trim() } })}
              >
                <Text style={styles.buttonText}>Continue to sign in</Text>
              </TouchableOpacity>
            </>
          ) : null}

          {step !== "done" ? (
            <TouchableOpacity style={styles.linkRow} onPress={() => router.replace("/(auth)/login")}>
              <Text style={[styles.linkText, { color: colors.blue }]}>Back to sign in</Text>
            </TouchableOpacity>
          ) : null}
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
  title: { fontSize: 28, fontWeight: "900" },
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
  mono: { fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }) },
  notice: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 4 },
  noticeText: { fontSize: 12, lineHeight: 18, fontWeight: "600" },
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
