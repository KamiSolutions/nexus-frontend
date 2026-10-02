/**
 * Single requisition display card for the Finance Operations
 * requisitions screen. Extracted from
 * app/(workspace)/finance/requisitions.tsx (2026-10-02) as a proof of
 * concept for the FOLDER_STRUCTURE.md component-extraction
 * recommendation — pure UI, no behavior change, no backend call (this
 * screen's data is local-only; see (workspace)/finance/index.tsx's
 * NotAvailablePanel for why).
 */
import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type PurchaseRequisition = {
  id: number;
  requester: string; // FK → employees.Employee (displaying name here)
  title: string;
  description: string;
  amount_estimate: number;
  created_at: string;
  updated_at: string;
};

export function RequisitionCard({
  requisition,
}: {
  requisition: PurchaseRequisition;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>Requester: {requisition.requester}</Text>
      <Text style={styles.cardText}>Title: {requisition.title}</Text>
      <Text style={styles.cardText}>
        Description: {requisition.description}
      </Text>
      <Text style={styles.cardText}>
        Amount: ZAR {requisition.amount_estimate.toLocaleString()}
      </Text>
      <Text style={styles.cardText}>Created: {requisition.created_at}</Text>
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
  cardText: { fontSize: 16 },
});
