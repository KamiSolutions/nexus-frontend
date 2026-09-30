import { useAuth } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  const { isSignedIn } = useAuth();

  // Real gate now: an unauthenticated visitor lands on the login screen,
  // not straight into the workspace (the old version redirected here
  // unconditionally, matching the login button's no-op behavior).
  return <Redirect href={isSignedIn ? "/(workspace)/dashboard" : "/(auth)/login"} />;
}
