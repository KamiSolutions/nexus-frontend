/**
 * Claims Submission Screen
 * Employees can submit insurance claims with policy details and supporting documentation
 *
 * Ported from the legacy flat route app/policies/claim.tsx into the
 * (workspace) Enterprise system — real sub-workflow content, moved rather
 * than discarded. Only the import paths changed (relative -> `@/*`).
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
} from "react-native";

export default function ClaimScreen() {
  const [policyNumber, setPolicyNumber] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [claimDescription, setClaimDescription] = useState("");

  const handleSubmit = () => {
    if (!policyNumber || !claimAmount || !claimDescription) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Here you would send the data to your backend
    Alert.alert("Success", "Claim submitted successfully!");

    // Reset form
    setPolicyNumber("");
    setClaimAmount("");
    setClaimDescription("");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Submit Claim</Text>

      <Text style={styles.label}>Policy Number</Text>
      <TextInput
        style={styles.input}
        value={policyNumber}
        onChangeText={setPolicyNumber}
        placeholder="Enter policy number"
        placeholderTextColor={Colors.light.icon}
      />

      <Text style={styles.label}>Claim Amount</Text>
      <TextInput
        style={styles.input}
        value={claimAmount}
        onChangeText={setClaimAmount}
        placeholder="Enter claim amount"
        keyboardType="numeric"
        placeholderTextColor={Colors.light.icon}
      />

      <Text style={styles.label}>Claim Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={claimDescription}
        onChangeText={setClaimDescription}
        placeholder="Describe the claim"
        multiline
        numberOfLines={4}
        placeholderTextColor={Colors.light.icon}
      />

      <Text style={styles.label}>Upload Supporting Documents</Text>
      <FileUpload />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Claim</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: Fonts.web?.sans || "system-ui",
    color: Colors.light.tint,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: Fonts.web?.sans || "system-ui",
    marginTop: 10,
    marginBottom: 5,
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: Fonts.web?.sans || "system-ui",
  },
});
