/**
 * Contracts Management Screen
 * Displays and manages employee contracts
 *
 * Ported from the legacy flat route app/hr/contracts.tsx — see leave.tsx
 * in this same folder for the migration note.
 *
 * 2026-10-02: form and card UI extracted into
 * components/modules/hr/{ContractForm,ContractCard}.tsx — third round of
 * the component-extraction pattern (see finance/requisitions.tsx and
 * hr/leave.tsx for the first two). This screen is now just the
 * container (local state + composition), no behavior change.
 */
import FileUpload from "@/app/components/FileUpload";
import {
  ContractCard,
  type Contract,
} from "@/components/modules/hr/ContractCard";
import {
  ContractForm,
  type NewContract,
} from "@/components/modules/hr/ContractForm";
import { Colors, Fonts } from "@/constants/theme";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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

  const totalContracts = contracts.length;

  const handleAddContract = (input: NewContract) => {
    const now = new Date().toISOString().split("T")[0];
    const contract: Contract = {
      ...input,
      id: contracts.length + 1,
      created_at: now,
      updated_at: now,
    };
    setContracts([contract, ...contracts]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Employee Contracts</Text>
      <Text style={styles.subtitle}>Total contracts: {totalContracts}</Text>

      {/* File Upload Component */}
      <FileUpload />

      <ContractForm onSubmit={handleAddContract} />

      <View style={styles.listContainer}>
        {contracts.map((c) => (
          <ContractCard key={c.id} contract={c} />
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
