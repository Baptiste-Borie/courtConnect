import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TerrainEventsTab({ theme }) {
  return (
    <View style={styles.card}>
      <Text style={[styles.title, { color: theme.text }]}>
        Événements à venir
      </Text>
      {/* Ajoute ici la liste des événements */}
      <Text style={{ color: theme.text + "99" }}>
        (À implémenter : liste des événements liés à ce terrain)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginTop: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
});
