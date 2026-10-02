/**
 * Single contract display card for the HR contracts screen. Extracted
 * from app/(workspace)/hr/contracts.tsx (2026-10-02) — third round of
 * the component-extraction pattern (see
 * components/modules/finance/RequisitionCard.tsx for the first). Pure
 * UI, no behavior change.
 */
import { Colors, Fonts } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type Contract = {
  id: number;
  employee: string;
  document_url: string;
  created_at: string;
  updated_at: string;
};

export function ContractCard({ contract }: { contract: Contract }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>Employee: {contract.employee}</Text>
      <Text style={styles.cardText}>Document: {contract.document_url}</Text>
      <Text style={styles.cardText}>Created: {contract.created_at}</Text>
      <Text style={styles.cardText}>Updated: {contract.updated_at}</Text>
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
