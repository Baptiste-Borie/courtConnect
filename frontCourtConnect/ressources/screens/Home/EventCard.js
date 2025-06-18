import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function EventCard({ event, distance, onPress, theme }) {
  return (
    <TouchableOpacity style={[styles.card]} onPress={onPress}>
      <View
        style={[
          styles.imagePlaceholder,
          { backgroundColor: theme.background_light },
        ]}
      />
      <Text style={[styles.name, { color: theme.text }]}>
        {event.terrain.nom}
      </Text>
      <Text style={{ color: theme.primary, fontSize: 12 }}>
        {distance.toFixed(1)} km
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: 120,
    padding: 8,
    marginRight: 12,
    alignItems: "flex-start",
  },
  imagePlaceholder: {
    width: "100%",
    height: 100,
    borderRadius: 6,
    marginBottom: 6,
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "flex-start",
  },
});
