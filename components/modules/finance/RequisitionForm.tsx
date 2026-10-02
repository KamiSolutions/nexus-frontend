/**
 * New-requisition form for the Finance Operations requisitions screen.
 * Extracted from app/(workspace)/finance/requisitions.tsx (2026-10-02) —
 * pure UI + local field state, no behavior change. Submission is handled
 * by the parent screen via onSubmit; this component owns only the draft
 * field values and resets them after a successful submit.
 */
import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { PurchaseRequisition } from "./RequisitionCard";

type NewRequisitionInput = {
  title: string;
  description: string;
  amount_estimate: string;
  requester: string;
};

const EMPTY_INPUT: NewRequisitionInput = {
  title: "",
  description: "",
  amount_estimate: "",
  requester: "",
};

export type NewRequisition = Omit<
  PurchaseRequisition,
  "id" | "created_at" | "updated_at"
>;

export function RequisitionForm({
  onSubmit,
}: {
  onSubmit: (requisition: NewRequisition) => void;
}) {
  const [newReq, setNewReq] = useState<NewRequisitionInput>(EMPTY_INPUT);

  const handleAdd = () => {
    if (
      !newReq.title ||
      !newReq.description ||
      !newReq.amount_estimate ||
      !newReq.requester
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    onSubmit({
      requester: newReq.requester,
      title: newReq.title,
      description: newReq.description,
      amount_estimate: parseFloat(newReq.amount_estimate),
    });
    setNewReq(EMPTY_INPUT);
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Requester Name"
        value={newReq.requester}
        onChangeText={(t) => setNewReq({ ...newReq, requester: t })}
      />
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={newReq.title}
        onChangeText={(t) => setNewReq({ ...newReq, title: t })}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={newReq.description}
        onChangeText={(t) => setNewReq({ ...newReq, description: t })}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount Estimate (ZAR)"
        value={newReq.amount_estimate}
        onChangeText={(t) => setNewReq({ ...newReq, amount_estimate: t })}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Requisition</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
