/**
 * Leave Management Screen
 * Employees can submit leave requests, managers can approve/reject
 *
 * Ported from the legacy flat route app/hr/leave.tsx into the (workspace)
 * Enterprise system — real sub-workflow content, moved rather than
 * discarded. Only the import paths changed (relative -> the `@/*` alias).
 */
import FileUpload from "@/app/components/FileUpload";
import { Colors, Fonts } from "@/constants/theme";
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

type LeaveApplication = {
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

  const [newLeave, setNewLeave] = useState({
    employee: "",
    line_manager: "",
    leave_type: "",
    period_from: "",
    period_to: "",
  });

  const totalLeaves = leaves.length;

  const handleAddLeave = () => {
    if (
      !newLeave.employee ||
      !newLeave.line_manager ||
      !newLeave.leave_type ||
      !newLeave.period_from ||
      !newLeave.period_to
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const leave: LeaveApplication = {
      id: leaves.length + 1,
      employee: newLeave.employee,
      line_manager: newLeave.line_manager,
      leave_type: newLeave.leave_type,
      period_from: newLeave.period_from,
      period_to: newLeave.period_to,
      status: "Pending",
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
      supporting_document_url: "",
    };

    setLeaves([leave, ...leaves]);
    setNewLeave({
      employee: "",
      line_manager: "",
      leave_type: "",
      period_from: "",
      period_to: "",
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Leave Applications</Text>
      <Text style={styles.subtitle}>
        Total applications this month: {totalLeaves}
      </Text>

      <FileUpload />

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Employee Name"
          value={newLeave.employee}
          onChangeText={(text) => setNewLeave({ ...newLeave, employee: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Line Manager"
          value={newLeave.line_manager}
          onChangeText={(text) =>
            setNewLeave({ ...newLeave, line_manager: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Leave Type (e.g., Sick, Annual, Family Responsibility)"
          value={newLeave.leave_type}
          onChangeText={(text) =>
            setNewLeave({ ...newLeave, leave_type: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Start Date (YYYY-MM-DD)"
          value={newLeave.period_from}
          onChangeText={(text) =>
            setNewLeave({ ...newLeave, period_from: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="End Date (YYYY-MM-DD)"
          value={newLeave.period_to}
          onChangeText={(text) => setNewLeave({ ...newLeave, period_to: text })}
        />

        <TouchableOpacity style={styles.button} onPress={handleAddLeave}>
          <Text style={styles.buttonText}>Add Leave</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {leaves.map((l) => (
          <View key={l.id} style={styles.card}>
            <Text style={styles.cardText}>Employee: {l.employee}</Text>
            <Text style={styles.cardText}>Line Manager: {l.line_manager}</Text>
            <Text style={styles.cardText}>Type: {l.leave_type}</Text>
            <Text style={styles.cardText}>
              Period: {l.period_from} → {l.period_to}
            </Text>
            <Text style={styles.cardText}>Status: {l.status}</Text>
            <Text style={styles.cardText}>Created: {l.created_at}</Text>
            <Text style={styles.cardText}>Updated: {l.updated_at}</Text>
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
  formContainer: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.tint,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontFamily: Fonts.web?.sans || "system-ui",
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: Fonts.web?.sans || "system-ui",
    fontWeight: "bold",
    fontSize: 16,
  },
  listContainer: { marginTop: 20 },
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
