import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import assets from "../../constants/assets";

export default function TerrainDetailTab({ terrain, theme }) {
  return (
    <View style={styles.card}>
      <View style={styles.infoRow}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Usure</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Image
              key={i}
              source={
                i <= terrain.usure
                  ? assets.icons.star_filled
                  : assets.icons.star
              }
              style={styles.starIcon}
            />
          ))}
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: theme.text }]}>Nom :</Text>
        <Text style={[styles.value, { color: theme.text }]}>{terrain.nom}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: theme.text }]}>Remarques :</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {terrain.remarque}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: theme.text }]}>Créé par :</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {terrain.created_by?.prenom || ""} {terrain.created_by?.nom || ""}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: theme.text }]}>Ville :</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {terrain.ville}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.label, { color: theme.text }]}>Adresse :</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {terrain.adresse}
        </Text>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={[styles.label, { color: theme.text }]}>Panier(s) :</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {terrain.type_panier.nom}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={[styles.label, { color: theme.text }]}>Sol :</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {terrain.type_sol.nom}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={[styles.label, { color: theme.text }]}>Filet :</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {terrain.type_filet.nom}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={[styles.label, { color: theme.text }]}>
            Spectateur :
          </Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {terrain.spectateur ? "Oui" : "Non"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: "row",
    marginLeft: 8,
    marginBottom: 16,
  },
  starIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    width: 100,
  },
  value: {
    flex: 1,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
    justifyContent: "space-between",
  },
  detailItem: {
    width: "48%",
    marginBottom: 12,
  },
});
