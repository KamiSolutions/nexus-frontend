/**
 * Requisitions Screen
 * Displays financial requisitions submission and approval workflow
 *
 * Ported from the legacy flat route app/financials/requisitions.tsx into
 * the (workspace) Enterprise system as part of the legacy-route
 * integration — real sub-workflow content, not dead weight, moved rather
 * than discarded. Only the import paths changed (relative paths -> the
 * `@/*` alias, since this file now lives one directory level deeper).
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

// PurchaseRequisition model
type PurchaseRequisition = {
  id: number;
  requester: string; // FK → employees.Employee (displaying name here)
  title: string;
  description: string;
  amount_estimate: number;
  created_at: string;
  updated_at: string;
};

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

  const [newReq, setNewReq] = useState({
    title: "",
    description: "",
    amount_estimate: "",
    requester: "",
  });

  const handleAddRequisition = () => {
    if (
      !newReq.title ||
      !newReq.description ||
      !newReq.amount_estimate ||
      !newReq.requester
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const req: PurchaseRequisition = {
      id: requisitions.length + 1,
      requester: newReq.requester,
      title: newReq.title,
      description: newReq.description,
      amount_estimate: parseFloat(newReq.amount_estimate),
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };

    setRequisitions([req, ...requisitions]);
    setNewReq({
      title: "",
      description: "",
      amount_estimate: "",
      requester: "",
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Purchase Requisitions</Text>
      <FileUpload />

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

        <TouchableOpacity style={styles.button} onPress={handleAddRequisition}>
          <Text style={styles.buttonText}>Add Requisition</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {requisitions.map((req) => (
          <View key={req.id} style={styles.card}>
            <Text style={styles.cardText}>Requester: {req.requester}</Text>
            <Text style={styles.cardText}>Title: {req.title}</Text>
            <Text style={styles.cardText}>Description: {req.description}</Text>
            <Text style={styles.cardText}>
              Amount: ZAR {req.amount_estimate.toLocaleString()}
            </Text>
            <Text style={styles.cardText}>Created: {req.created_at}</Text>
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
