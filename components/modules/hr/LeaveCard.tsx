/**
 * Single leave-application display card for the HR leave screen.
 * Extracted from app/(workspace)/hr/leave.tsx (2026-10-02) as the second
 * round of the FOLDER_STRUCTURE.md component-extraction pattern (see
 * components/modules/finance/RequisitionCard.tsx for the first) — pure
 * UI, no behavior change.
 */
import { Colors, Fonts } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type LeaveApplication = {
  id: number;
  employee: string;
  line_manager: string;
  leave_type: string;
  period_from: string;
  period_to: string;
  status: "Pending" | "Approved" | "Declined";
  supporting_document_url?: string;
  created_at: string;
  updated_at: string;
};

export function LeaveCard({ leave }: { leave: LeaveApplication }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>Employee: {leave.employee}</Text>
      <Text style={styles.cardText}>Line Manager: {leave.line_manager}</Text>
      <Text style={styles.cardText}>Type: {leave.leave_type}</Text>
      <Text style={styles.cardText}>
        Period: {leave.period_from} → {leave.period_to}
      </Text>
      <Text style={styles.cardText}>Status: {leave.status}</Text>
      <Text style={styles.cardText}>Created: {leave.created_at}</Text>
      <Text style={styles.cardText}>Updated: {leave.updated_at}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#f0f4f7",
    borderLeftWidth: 5,
    borderLeftColor: Colors.light.tint,
  },
  cardText: {
    fontSize: 16,
    fontFamily: Fonts.web?.sans || "system-ui",
    color: Colors.light.text,
  },
});
