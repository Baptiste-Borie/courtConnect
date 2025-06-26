import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

export default function SuppressionCourtsTab({
  courts,
  imagesUriMap,
  onValidate,
}) {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return courts
    .filter((terrain) => terrain.etat_delete === 0)
    .map((terrain) => (
      <TouchableOpacity
        key={`terrain-${terrain.id}`}
        onPress={() =>
          navigation.navigate("TerrainDetail", {
            terrainId: terrain.id,
            buttonActivated: true,
          })
        }
      >
        <View
          style={[styles.card, { backgroundColor: theme.background_light }]}
        >
          <View style={styles.headerRow}>
            <View style={styles.terrainInfo}>
              <Image
                source={{ uri: imagesUriMap[terrain.id] }}
                style={styles.terrainImage}
                resizeMode="cover"
              />
              <View style={styles.terrainText}>
                <Text style={[styles.name, { color: theme.text }]}>
                  {terrain.nom}
                </Text>
                <Text style={[styles.info, { color: theme.text + "99" }]}>
                  {terrain.adresse || "Adresse inconnue"}
                </Text>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onValidate(terrain.id, "validate");
                }}
              >
                <Text style={{ color: "green", fontSize: 18 }}>✓</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onValidate(terrain.id, "refuse");
                }}
              >
                <Text style={{ color: "red", fontSize: 18 }}>✗</Text>
              </TouchableOpacity>
            </View>
          </View>
          {terrain.created_by && (
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[styles.info, { color: theme.text + "99" }]}>
                Suppression :
                {terrain.created_by.prenom && terrain.created_by.nom
                  ? `${terrain.created_by.prenom} ${terrain.created_by.nom}`
                  : terrain.created_by.username || "Utilisateur inconnu"}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    ));
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  terrainInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  terrainImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  terrainText: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  info: {
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
});
