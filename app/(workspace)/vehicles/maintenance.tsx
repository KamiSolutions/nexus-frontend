/**
 * Vehicle Maintenance Tracking Screen
 * Displays maintenance history, service schedules, and maintenance records
 *
 * Ported from the legacy flat route app/vehicles/maintenance.tsx into the
 * (workspace) Enterprise system — real sub-workflow content, moved rather
 * than discarded. Only the import paths changed (relative -> `@/*`).
 */
import FileUpload from "@/app/components/FileUpload";
import { Colors } from "@/constants/theme";
import React from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

const Maintenance = () => {
  const records = [
    {
      id: "1",
      vehicle: "Toyota Etios",
      lastService: "2025-06-10",
      nextService: "2025-12-01",
      mileage: "75,000 km",
      serviceCenter: "AutoFix Workshop, Cape Town",
      cost: "R3,200",
    },
    {
      id: "2",
      vehicle: "Ford Raptor",
      lastService: "2025-05-02",
      nextService: "2025-11-10",
      mileage: "40,500 km",
      serviceCenter: "Hi-Tech Motors, Johannesburg",
      cost: "R4,800",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Vehicle Maintenance Records</Text>
      <Text style={styles.subtitle}>Total Records: {records.length}</Text>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.vehicle}>{item.vehicle}</Text>
            <Text>Last Service: {item.lastService}</Text>
            <Text>Next Service: {item.nextService}</Text>
            <Text>Mileage: {item.mileage}</Text>
            <Text>Service Center: {item.serviceCenter}</Text>
            <Text>Cost: {item.cost}</Text>
          </View>
        )}
      />

      <View style={styles.uploadContainer}>
        <Text style={styles.uploadTitle}>Upload Maintenance Record</Text>
        <FileUpload
          onFileSelect={(file) =>
            console.log("Maintenance file uploaded:", file)
          }
        />
      </View>
    </ScrollView>
  );
};

export default Maintenance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.light.tint,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
  },
  vehicle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
  },
  uploadContainer: {
    marginTop: 20,
  },
  uploadTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
});
