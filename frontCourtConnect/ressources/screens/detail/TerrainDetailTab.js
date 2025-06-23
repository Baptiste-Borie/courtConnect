import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import { TouchableOpacity } from "react-native";
import assets from "../../constants/assets";
import { authFetch } from "../../utils/AuthFetch";
import Button from "../../shared/Button";

export default function TerrainDetailTab({
  terrain,
  theme,
  isFavorite,
  toggleFavorite,
  user,
}) {
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = async (action) => {
    if (hasVoted) {
      Alert.alert("Vote déjà effectué", "Vous avez déjà voté pour ce terrain.");
      return;
    }

    await handleValidation(terrain.id, action);
    setHasVoted(true);
  };

  const handleValidation = async (terrainId, action) => {
    try {
      await authFetch(`/api/terrain/${terrainId}/${action}`, {
        method: "POST",
      });
    } catch (err) {
      console.error(
        `Erreur lors de la ${action} du terrain ${terrainId} :`,
        err
      );
    }
  };

  return (
    <View style={styles.card}>
      <View style={[styles.rowBetween, { marginBottom: 8 }]}>
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
        {terrain.etat !== 0 && terrain.etat_delete !== 0 && (
          <TouchableOpacity onPress={toggleFavorite}>
            <Image
              source={
                user?.roles?.includes("ROLE_PREMIUM")
                  ? isFavorite
                    ? assets.icons.heart_filled
                    : assets.icons.heart
                  : assets.icons.heart
              }
              style={[
                styles.heartIcon,
                {
                  tintColor: user?.roles?.includes("ROLE_TRUSTED")
                    ? "#e74c3c"
                    : theme.text,
                },
              ]}
            />
          </TouchableOpacity>
        )}
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

      {(terrain.etat === 0 || terrain.etat_delete === 0) && !hasVoted && (
        <View style={styles.voteRow}>
          <Button
            title={"Refuser"}
            onPress={() => handleVote("refuse")}
            color="background_light"
            style={{ borderColor: theme.primary, borderWidth: 1 }}
          />
          <Button title={"Accepter"} onPress={() => handleVote("validate")} />
        </View>
      )}
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
    marginBottom: 10,
    marginRight: 120,
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
    justifyContent: "space-between",
  },
  voteRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 16,
  },
  detailItem: {
    width: "48%",
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heartIcon: {
    width: 24,
    height: 24,
    tintColor: "#e74c3c",
  },
});
