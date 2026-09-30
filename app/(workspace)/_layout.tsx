import RoleProtected from "@/app/components/RoleProtected";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function WorkspaceLayout() {
  const { isSignedIn } = useAuth();

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
