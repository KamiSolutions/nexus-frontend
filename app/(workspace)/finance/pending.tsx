/**
 * Pending Approvals Screen
 * Displays pending financial requisitions awaiting manager approval
 *
 * Ported from the legacy flat route app/financials/pending.tsx — see
 * requisitions.tsx in this same folder for the migration note.
 */
import FileUpload from "@/app/components/FileUpload";
import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// PurchaseRequisitionApproval model
type PurchaseRequisitionApproval = {
  id: number;
  requisition_id: number;
  approver: string;
  status: "Pending" | "Approved" | "Declined";
  created_at: string;
  updated_at: string;
};

export default function PendingApprovalsScreen() {
  const [approvals, setApprovals] = useState<PurchaseRequisitionApproval[]>([
    {
      id: 1,
      requisition_id: 1,
      approver: "Manager A",
      status: "Pending",
      created_at: "2025-10-01",
      updated_at: "2025-10-02",
    },
  ]);

  const [newApproval, setNewApproval] = useState({
    requisition_id: "",
    approver: "",
  });

  const handleAddApproval = () => {
    if (!newApproval.requisition_id || !newApproval.approver) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const approval: PurchaseRequisitionApproval = {
      id: approvals.length + 1,
      requisition_id: parseInt(newApproval.requisition_id),
      approver: newApproval.approver,
      status: "Pending",
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };

    setApprovals([approval, ...approvals]);
    setNewApproval({ requisition_id: "", approver: "" });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pending Approvals</Text>
      <FileUpload />

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Requisition ID"
          value={newApproval.requisition_id}
          onChangeText={(t) =>
            setNewApproval({ ...newApproval, requisition_id: t })
          }
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Approver Name"
          value={newApproval.approver}
          onChangeText={(t) => setNewApproval({ ...newApproval, approver: t })}
        />

        <TouchableOpacity style={styles.button} onPress={handleAddApproval}>
          <Text style={styles.buttonText}>Add Approval</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {approvals.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardText}>
              Requisition ID: {item.requisition_id}
            </Text>
            <Text style={styles.cardText}>Approver: {item.approver}</Text>
            <Text style={styles.cardText}>Status: {item.status}</Text>
            <Text style={styles.cardText}>Created: {item.created_at}</Text>
          </View>
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
  formContainer: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.tint,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  listContainer: { marginTop: 20 },
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
