/**
 * A row of quick-navigation chips into a module's real sub-workflows.
 *
 * Used on the (workspace) module overview screens (finance, hr, policies,
 * vehicles) to surface the legacy sub-workflow routes that were ported in
 * from the old flat route system (requisitions, leave, claims, etc.) —
 * otherwise that real content would exist on disk but be unreachable from
 * the UI, which defeats the point of integrating it rather than deleting
 * it.
 */
import { useEnterpriseTheme } from "@/providers/ThemeProvider";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type QuickLink = {
  label: string;
  href: string;
};

export function ModuleQuickLinks({ links }: { links: QuickLink[] }) {
  const { colors, isDark } = useEnterpriseTheme();

  return (
    <View style={styles.row}>
      {links.map((link) => (
        <Link key={link.href} href={link.href as any} asChild>
          {/*
           * `asChild` makes expo-router hand this element's props to
           * @radix-ui/react-slot on web, which merges ITS OWN style prop
           * into ours via `{...ourStyle, ...itsStyle}`. That merge assumes
           * a plain object — RN's `style={[a, b]}` array convention breaks
           * it, because spreading an array pollutes the merged object with
           * numeric keys ("0", "1", ...). React DOM then tries to assign
           * those as CSS properties on the real <a> node and Chrome throws
           * "Failed to set an indexed property [0] on 'CSSStyleDeclaration'".
           * StyleSheet.flatten() collapses the array to one plain object
           * first, which is the correct way to hand a style to a component
           * that isn't RN's own style-array-aware View/Text — exactly this
           * situation. Only reachable when the child is slotted like this;
           * every other component in this file tree passes real RN
           * View/Text style arrays and is unaffected.
           */}
          <Text
            style={StyleSheet.flatten([
              styles.chip,
              {
                borderColor: colors.borderStrong,
                backgroundColor: isDark ? colors.hover : colors.background,
                color: colors.blue,
              },
            ])}
          >
            {link.label}
          </Text>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    fontWeight: "800",
    overflow: "hidden",
  },
});
