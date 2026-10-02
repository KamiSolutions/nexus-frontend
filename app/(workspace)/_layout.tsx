import RoleProtected from "@/app/components/RoleProtected";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { useAuth } from "@/providers/AuthProvider";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function WorkspaceLayout() {
  const { isSignedIn, isRehydrating } = useAuth();
  const { colors } = useEnterpriseTheme();

  // 2026-10-02: a persisted token is still being re-validated against the
  // server (see AuthProvider's rehydration effect) — wait for that instead
  // of treating "not signed in yet" as "never signed in" and bouncing a
  // returning user out to /login before their session has had a chance to
  // restore.
  if (isRehydrating) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.blue} />
      </View>
    );
  }

  // Gate the entire workspace behind a real sign-in before WorkspaceShell
  // (and everything inside it, including TopNav's use of the current
  // user) ever mounts. RoleProtected below then handles the finer-grained
  // per-route permission check once we know a user is actually signed in.
  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <WorkspaceShell>
      <RoleProtected>
        <Stack screenOptions={{ headerShown: false }} />
      </RoleProtected>
    </WorkspaceShell>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
