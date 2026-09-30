import { roleLabels } from "@/lib/permissions";
import { useAuth } from "@/providers/AuthProvider";
import { useTenant } from "@/providers/TenantProvider";
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { useWorkspace } from "@/providers/WorkspaceProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export function TopNav() {
  const { user, signOut } = useAuth();
  const { activeCompany } = useTenant();
  const { colors, isDark, mode, toggleTheme } = useEnterpriseTheme();
  const { setCommandPaletteOpen } = useWorkspace();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/login");
  };

  // `user` should never actually be null here — (workspace)/_layout.tsx
  // redirects to /login before WorkspaceShell (and this component) ever
  // mounts — but this stays null-safe defensively rather than assuming
  // that invariant holds forever.
  const displayName = user?.name ?? "Signed out";
  const displayRole = user ? roleLabels[user.role] : "";

  return (
    <View style={[styles.topNav, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={[styles.search, { borderColor: colors.borderStrong, backgroundColor: isDark ? colors.card : colors.background }]}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          placeholder="Search companies, approvals, people, vehicles..."
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      <TouchableOpacity
        style={[styles.action, { borderColor: colors.borderStrong, backgroundColor: isDark ? colors.card : "transparent" }]}
        onPress={() => setCommandPaletteOpen(true)}
      >
        <Ionicons name="flash-outline" size={18} color={colors.blue} />
        <Text style={[styles.actionText, { color: colors.text }]}>Quick actions</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.iconButton, { borderColor: colors.borderStrong, backgroundColor: isDark ? colors.card : "transparent" }]}
        onPress={toggleTheme}
      >
        <Ionicons name={mode === "dark" ? "sunny-outline" : "moon-outline"} size={18} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.iconButton, { borderColor: colors.borderStrong, backgroundColor: isDark ? colors.card : "transparent" }]}>
        <Ionicons name="notifications-outline" size={18} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.iconButton, { borderColor: colors.borderStrong, backgroundColor: isDark ? colors.card : "transparent" }]}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.profile}>
        <View style={[styles.avatar, { backgroundColor: activeCompany.brandColor }]}>
          <Text style={styles.avatarText}>{displayName.slice(0, 1).toUpperCase()}</Text>
        </View>
        <View>
          <Text style={[styles.userName, { color: colors.text }]}>{displayName}</Text>
          <Text style={[styles.userRole, { color: colors.textMuted }]}>{displayRole}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topNav: {
    minHeight: 72,
    borderBottomWidth: 1,
    paddingHorizontal: 22,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  search: {
    flex: 1,
    minWidth: 260,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 14,
    fontWeight: "600",
  },
  action: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "800",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "900",
  },
  userName: {
    fontSize: 13,
    fontWeight: "900",
  },
  userRole: {
    fontSize: 12,
    fontWeight: "700",
  },
});
