/**
 * Loan Management Screen
 * Employees can request loans and track application status
 *
 * Ported from the legacy flat route app/financials/loan.tsx — see
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

// Borrower model (local representation)
type Borrower = {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  amount_requested: number;
  purpose: string;
  repayment_period: string;
  created_at: string;
};

export default function BorrowerScreen() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [newBorrower, setNewBorrower] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    amount_requested: "",
    purpose: "",
    repayment_period: "",
  });

  const handleAddBorrower = () => {
    const {
      full_name,
      email,
      phone_number,
      amount_requested,
      purpose,
      repayment_period,
    } = newBorrower;

    if (
      !full_name ||
      !email ||
      !phone_number ||
      !amount_requested ||
      !purpose ||
      !repayment_period
    ) {
      Alert.alert("Error", "Please fill all fields before submitting");
      return;
    }

    const borrower: Borrower = {
      id: borrowers.length + 1,
      full_name,
      email,
      phone_number,
      amount_requested: parseFloat(amount_requested),
      purpose,
      repayment_period,
      created_at: new Date().toISOString().split("T")[0],
    };

    setBorrowers([borrower, ...borrowers]);
    setNewBorrower({
      full_name: "",
      email: "",
      phone_number: "",
      amount_requested: "",
      purpose: "",
      repayment_period: "",
    });

    Alert.alert("Success", "Borrower information submitted!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Borrower Application Form</Text>
      <FileUpload />

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={newBorrower.full_name}
          onChangeText={(t) => setNewBorrower({ ...newBorrower, full_name: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          value={newBorrower.email}
          onChangeText={(t) => setNewBorrower({ ...newBorrower, email: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={newBorrower.phone_number}
          onChangeText={(t) =>
            setNewBorrower({ ...newBorrower, phone_number: t })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Amount Requested (ZAR)"
          keyboardType="numeric"
          value={newBorrower.amount_requested}
          onChangeText={(t) =>
            setNewBorrower({ ...newBorrower, amount_requested: t })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Purpose of Loan"
          multiline
          numberOfLines={3}
          value={newBorrower.purpose}
          onChangeText={(t) => setNewBorrower({ ...newBorrower, purpose: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="Repayment Period (in months)"
          keyboardType="numeric"
          value={newBorrower.repayment_period}
          onChangeText={(t) =>
            setNewBorrower({ ...newBorrower, repayment_period: t })
          }
        />

        <TouchableOpacity style={styles.button} onPress={handleAddBorrower}>
          <Text style={styles.buttonText}>Submit Borrower Info</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {borrowers.map((b) => (
          <View key={b.id} style={styles.card}>
            <Text style={styles.cardText}>Name: {b.full_name}</Text>
            <Text style={styles.cardText}>Email: {b.email}</Text>
            <Text style={styles.cardText}>Phone: {b.phone_number}</Text>
            <Text style={styles.cardText}>
              Amount: ZAR {b.amount_requested.toLocaleString()}
            </Text>
            <Text style={styles.cardText}>
              Repayment: {b.repayment_period} months
            </Text>
            <Text style={styles.cardText}>Purpose: {b.purpose}</Text>
            <Text style={styles.cardText}>Date: {b.created_at}</Text>
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
    backgroundColor: "#fff",
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
