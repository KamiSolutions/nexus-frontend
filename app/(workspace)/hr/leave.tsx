/**
 * Leave Management Screen
 * Employees can submit leave requests, managers can approve/reject
 *
 * Ported from the legacy flat route app/hr/leave.tsx into the (workspace)
 * Enterprise system — real sub-workflow content, moved rather than
 * discarded.
 *
 * 2026-10-02: form and card UI extracted into
 * components/modules/hr/{LeaveForm,LeaveCard}.tsx — second round of the
 * component-extraction pattern (see finance/requisitions.tsx for the
 * first). This screen is now just the container (local state +
 * composition), no behavior change.
 */
import FileUpload from "@/app/components/FileUpload";
import {
  LeaveCard,
  type LeaveApplication,
} from "@/components/modules/hr/LeaveCard";
import { LeaveForm, type NewLeave } from "@/components/modules/hr/LeaveForm";
import { Colors, Fonts } from "@/constants/theme";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function LeaveScreen() {
  const [leaves, setLeaves] = useState<LeaveApplication[]>([
    {
      id: 1,
      employee: "John Doe",
      line_manager: "Sarah Lee",
      leave_type: "Sick",
      period_from: "2025-10-05",
      period_to: "2025-10-07",
      status: "Pending",
      supporting_document_url: "",
      created_at: "2025-10-04",
      updated_at: "2025-10-04",
    },
    {
      id: 2,
      employee: "Jane Smith",
      line_manager: "Mark Thompson",
      leave_type: "Annual",
      period_from: "2025-10-10",
      period_to: "2025-10-14",
      status: "Approved",
      supporting_document_url: "",
      created_at: "2025-10-08",
      updated_at: "2025-10-09",
    },
  ]);

  const totalLeaves = leaves.length;

  const handleAddLeave = (input: NewLeave) => {
    const leave: LeaveApplication = {
      ...input,
      id: leaves.length + 1,
      status: "Pending",
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
      supporting_document_url: "",
    };
    setLeaves([leave, ...leaves]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Leave Applications</Text>
      <Text style={styles.subtitle}>
        Total applications this month: {totalLeaves}
      </Text>

      <FileUpload />

      <LeaveForm onSubmit={handleAddLeave} />

      <View style={styles.listContainer}>
        {leaves.map((l) => (
          <LeaveCard key={l.id} leave={l} />
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
    fontFamily: Fonts.web?.sans || "system-ui",
    color: Colors.light.tint,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: Fonts.web?.sans || "system-ui",
    color: Colors.light.text,
    marginBottom: 20,
  },
  listContainer: { marginTop: 20 },
});
