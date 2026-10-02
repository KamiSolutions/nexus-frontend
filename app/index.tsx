import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const { isSignedIn, isRehydrating } = useAuth();
  const { colors } = useEnterpriseTheme();

  // 2026-10-02: wait for a persisted token (if any) to be re-validated
  // against the server before deciding where to send the visitor — without
  // this, a returning signed-in user briefly flashes the login screen
  // (isSignedIn starts false on every launch, rehydration is async).
  if (isRehydrating) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.blue} />
      </View>
    );
  }

  // Real gate now: an unauthenticated visitor lands on the login screen,
  // not straight into the workspace (the old version redirected here
  // unconditionally, matching the login button's no-op behavior).
  return <Redirect href={isSignedIn ? "/(workspace)/dashboard" : "/(auth)/login"} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
