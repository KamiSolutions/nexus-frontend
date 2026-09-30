/**
 * Route-level access guard.
 *
 * Before this existed (the file was a genuine 0-byte placeholder), access
 * control was sidebar-item-hiding only via `canAccess()` in
 * EnterpriseSidebar — a user who typed or deep-linked to a route their
 * role can't use would still land on it. This actually blocks the
 * navigation: mounted once in `app/(workspace)/_layout.tsx`, it looks at
 * the current pathname on every route change and either renders the
 * screen, or a real "access restricted" panel if the signed-in role lacks
 * the permission that route requires.
 *
 * Sign-in itself is gated one level up (see `(workspace)/_layout.tsx`),
 * so this component can assume it is only ever rendered for an
 * authenticated user.
 */
import { usePermissions } from "@/providers/PermissionsProvider";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import type { Permission } from "@/lib/permissions";
import { usePathname } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Path prefix -> permission required to view it. Keep this in sync with
// EnterpriseSidebar's `navItems` — the sidebar hides items a role can't
// use; this is what actually stops a direct navigation to one.
const ROUTE_PERMISSIONS: { prefix: string; permission: Permission }[] = [
  { prefix: "/dashboard", permission: "dashboard:view" },
  { prefix: "/companies", permission: "companies:view" },
  { prefix: "/employees", permission: "employees:view" },
  { prefix: "/finance", permission: "finance:view" },
  { prefix: "/hr", permission: "hr:view" },
  { prefix: "/vehicles", permission: "vehicles:view" },
  { prefix: "/claims", permission: "claims:view" },
  { prefix: "/leases", permission: "leases:view" },
  { prefix: "/policies", permission: "policies:view" },
  { prefix: "/analytics", permission: "analytics:view" },
  { prefix: "/reports", permission: "reports:view" },
  { prefix: "/billing", permission: "billing:view" },
  { prefix: "/settings", permission: "settings:view" },
  { prefix: "/admin", permission: "admin:view" },
];

function permissionForPath(pathname: string): Permission | null {
  const match = ROUTE_PERMISSIONS.find((entry) => pathname.startsWith(entry.prefix));
  return match ? match.permission : null;
}

export default function RoleProtected({ children }: { children: React.ReactNode }) {
  const { canAccess } = usePermissions();
  const pathname = usePathname();
  const { colors } = useEnterpriseTheme();

  const required = permissionForPath(pathname);

  if (required && !canAccess(required)) {
    return (
      <View style={[styles.denied, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Access restricted</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>
          Your role does not have the &quot;{required}&quot; permission needed for this workspace area. Ask a
          Company Admin or Group Admin to grant it if you believe this is wrong.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  denied: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
  },
  body: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: 420,
    lineHeight: 20,
  },
});
