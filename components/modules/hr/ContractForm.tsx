/**
 * New-contract form for the HR contracts screen. Extracted from
 * app/(workspace)/hr/contracts.tsx (2026-10-02) — pure UI + local field
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
import type { Contract } from "./ContractCard";

type NewContractInput = {
  employee: string;
  document_url: string;
};

const EMPTY_INPUT: NewContractInput = {
  employee: "",
  document_url: "",
};

export type NewContract = Omit<
  Contract,
  "id" | "created_at" | "updated_at"
>;

export function ContractForm({
  onSubmit,
}: {
  onSubmit: (contract: NewContract) => void;
}) {
  const [newContract, setNewContract] = useState<NewContractInput>(EMPTY_INPUT);

  const handleAdd = () => {
    if (!newContract.employee || !newContract.document_url) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    onSubmit({
      employee: newContract.employee,
      document_url: newContract.document_url,
    });
    setNewContract(EMPTY_INPUT);
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Employee Name"
        value={newContract.employee}
        onChangeText={(text) =>
          setNewContract({ ...newContract, employee: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Document URL"
        value={newContract.document_url}
        onChangeText={(text) =>
          setNewContract({ ...newContract, document_url: text })
        }
      />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Contract</Text>
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
