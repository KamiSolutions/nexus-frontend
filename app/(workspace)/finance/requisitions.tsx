/**
 * Requisitions Screen
 * Displays financial requisitions submission and approval workflow
 *
 * Ported from the legacy flat route app/financials/requisitions.tsx into
 * the (workspace) Enterprise system as part of the legacy-route
 * integration — real sub-workflow content, not dead weight, moved rather
 * than discarded.
 *
 * 2026-10-02: form and card UI extracted into
 * components/modules/finance/{RequisitionForm,RequisitionCard}.tsx as a
 * proof-of-concept for the FOLDER_STRUCTURE.md component-extraction
 * recommendation — this screen is now just the container (local state +
 * composition), no behavior change. This screen's requisition data is
 * still local-only demo state, not backed by a real endpoint — see
 * (workspace)/finance/index.tsx's NotAvailablePanel for why (no
 * requisitions/approvals backend entity exists yet, only the real policy
 * ledger has been built — see the Policies screen for that).
 */
import FileUpload from "@/app/components/FileUpload";
import {
  RequisitionCard,
  type PurchaseRequisition,
} from "@/components/modules/finance/RequisitionCard";
import {
  RequisitionForm,
  type NewRequisition,
} from "@/components/modules/finance/RequisitionForm";
import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function RequisitionsScreen() {
  const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>([
    {
      id: 1,
      requester: "John Doe",
      title: "Office Chairs",
      description: "Requisition for new chairs in HR department",
      amount_estimate: 4500,
      created_at: "2025-10-01",
      updated_at: "2025-10-02",
    },
  ]);

  const handleAddRequisition = (input: NewRequisition) => {
    const req: PurchaseRequisition = {
      ...input,
      id: requisitions.length + 1,
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };
    setRequisitions([req, ...requisitions]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Purchase Requisitions</Text>
      <FileUpload />

      <RequisitionForm onSubmit={handleAddRequisition} />

      <View style={styles.listContainer}>
        {requisitions.map((req) => (
          <RequisitionCard key={req.id} requisition={req} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.tint,
    marginBottom: 10,
  },
  listContainer: { marginTop: 20 },
});
