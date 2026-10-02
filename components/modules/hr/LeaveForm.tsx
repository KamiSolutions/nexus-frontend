/**
 * New-leave-application form for the HR leave screen. Extracted from
 * app/(workspace)/hr/leave.tsx (2026-10-02) — pure UI + local field
 * state, no behavior change. Submission is handled by the parent screen
 * via onSubmit; this component owns only the draft field values and
 * resets them after a successful submit.
 */
import { Colors, Fonts } from "@/constants/theme";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { LeaveApplication } from "./LeaveCard";

type NewLeaveInput = {
  employee: string;
  line_manager: string;
  leave_type: string;
  period_from: string;
  period_to: string;
};

const EMPTY_INPUT: NewLeaveInput = {
  employee: "",
  line_manager: "",
  leave_type: "",
  period_from: "",
  period_to: "",
};

export type NewLeave = Omit<
  LeaveApplication,
  "id" | "status" | "created_at" | "updated_at" | "supporting_document_url"
>;

export function LeaveForm({
  onSubmit,
}: {
  onSubmit: (leave: NewLeave) => void;
}) {
  const [newLeave, setNewLeave] = useState<NewLeaveInput>(EMPTY_INPUT);

  const handleAdd = () => {
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

    onSubmit({
      employee: newLeave.employee,
      line_manager: newLeave.line_manager,
      leave_type: newLeave.leave_type,
      period_from: newLeave.period_from,
      period_to: newLeave.period_to,
    });
    setNewLeave(EMPTY_INPUT);
  };

  return (
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

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Leave</Text>
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
});
