/**
 * Approved Financials Screen
 * Displays list of approved financial requisitions
 *
 * Ported from the legacy flat route app/financials/approved.tsx — see
 * requisitions.tsx in this same folder for the migration note.
 */
import FileUpload from "@/app/components/FileUpload";
import { Colors, Fonts } from "@/constants/theme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type ApprovedFinancial = {
  id: number;
  description: string;
  amount: number;
  date: string;
};

export default function ApprovedFinancialsScreen() {
  const approvedList: ApprovedFinancial[] = [
    {
      id: 1,
      description: "Stationery Requisition",
      amount: 1200,
      date: "2025-10-01",
    },
    {
      id: 2,
      description: "Office Chairs Requisition",
      amount: 4500,
      date: "2025-10-05",
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Approved Financials</Text>
      <Text style={styles.subtitle}>Total approved: {approvedList.length}</Text>
      <FileUpload />

      <View style={styles.listContainer}>
        {approvedList.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardText}>Description: {item.description}</Text>
            <Text style={styles.cardText}>
              Amount: ZAR {item.amount.toLocaleString()}
            </Text>
            <Text style={styles.cardText}>Date: {item.date}</Text>
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
