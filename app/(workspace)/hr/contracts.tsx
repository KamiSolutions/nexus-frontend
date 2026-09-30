/**
 * Contracts Management Screen
 * Displays and manages employee contracts
 *
 * Ported from the legacy flat route app/hr/contracts.tsx — see leave.tsx
 * in this same folder for the migration note.
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

type Contract = {
  id: number;
  employee: string;
  document_url: string;
  created_at: string;
  updated_at: string;
};

export default function ContractsScreen() {
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: 1,
      employee: "John Doe",
      document_url: "https://example.com/contracts/john.pdf",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
    {
      id: 2,
      employee: "Jane Smith",
      document_url: "https://example.com/contracts/jane.pdf",
      created_at: "2024-03-15",
      updated_at: "2024-03-15",
    },
  ]);

  const [newContract, setNewContract] = useState({
    employee: "",
    document_url: "",
  });

  const totalContracts = contracts.length;

  const handleAddContract = () => {
    if (!newContract.employee || !newContract.document_url) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const now = new Date().toISOString().split("T")[0];

    const contract: Contract = {
      id: contracts.length + 1,
      employee: newContract.employee,
      document_url: newContract.document_url,
      created_at: now,
      updated_at: now,
    };

    setContracts([contract, ...contracts]);
    setNewContract({ employee: "", document_url: "" });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Employee Contracts</Text>
      <Text style={styles.subtitle}>Total contracts: {totalContracts}</Text>

      {/* File Upload Component */}
      <FileUpload />

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

        <TouchableOpacity style={styles.button} onPress={handleAddContract}>
          <Text style={styles.buttonText}>Add Contract</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {contracts.map((c) => (
          <View key={c.id} style={styles.card}>
            <Text style={styles.cardText}>Employee: {c.employee}</Text>
            <Text style={styles.cardText}>Document: {c.document_url}</Text>
            <Text style={styles.cardText}>Created: {c.created_at}</Text>
            <Text style={styles.cardText}>Updated: {c.updated_at}</Text>
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
